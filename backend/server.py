from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
import uuid
import shutil

from models import (
    Profile, ProfileUpdate,
    Experience, ExperienceCreate, ExperienceUpdate,
    Research, ResearchCreate, ResearchUpdate,
    Validator, ValidatorCreate, ValidatorUpdate,
    Post, PostCreate, PostUpdate,
    LoginRequest, LoginResponse, AdminUser
)
from seed_data import (
    default_profile, default_experiences, default_research,
    default_validators, default_posts, default_admin
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'fahmy_portfolio')]

# Security
SECRET_KEY = os.environ.get('JWT_SECRET', 'fahmy-web3-portfolio-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

# Create the main app
app = FastAPI(title="Fahmy Web3 Portfolio API")

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            return None
        return {"email": email, "name": payload.get("name", "Admin")}
    except jwt.PyJWTError:
        return None

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# Seed database on startup
async def seed_database():
    """Seed the database with default data if empty"""
    # Check if profile exists
    profile = await db.profile.find_one()
    if not profile:
        await db.profile.insert_one(default_profile)
        logger.info("Seeded profile data")
    
    # Check if experiences exist
    exp_count = await db.experiences.count_documents({})
    if exp_count == 0:
        await db.experiences.insert_many(default_experiences)
        logger.info("Seeded experiences data")
    
    # Check if research exists
    res_count = await db.research.count_documents({})
    if res_count == 0:
        await db.research.insert_many(default_research)
        logger.info("Seeded research data")
    
    # Check if validators exist
    val_count = await db.validators.count_documents({})
    if val_count == 0:
        await db.validators.insert_many(default_validators)
        logger.info("Seeded validators data")
    
    # Check if posts exist
    post_count = await db.posts.count_documents({})
    if post_count == 0:
        await db.posts.insert_many(default_posts)
        logger.info("Seeded posts data")
    
    # Check if admin exists
    admin = await db.admins.find_one()
    if not admin:
        # Hash the default password
        default_admin["password_hash"] = get_password_hash("admin123")
        await db.admins.insert_one(default_admin)
        logger.info("Seeded admin user")

@app.on_event("startup")
async def startup_event():
    await seed_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    admin = await db.admins.find_one({"email": request.email})
    if not admin or not verify_password(request.password, admin["password_hash"]):
        return LoginResponse(success=False, error="Invalid credentials")
    
    token = create_access_token({"sub": admin["email"], "name": admin["name"]})
    return LoginResponse(
        success=True,
        token=token,
        user={"email": admin["email"], "name": admin["name"], "role": admin["role"]}
    )

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(require_auth)):
    return {"user": user}

# ==================== PROFILE ROUTES ====================

@api_router.get("/profile", response_model=Profile)
async def get_profile():
    profile = await db.profile.find_one()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return Profile(**{k: v for k, v in profile.items() if k != '_id'})

@api_router.put("/profile", response_model=Profile)
async def update_profile(update: ProfileUpdate, user: dict = Depends(require_auth)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if update_data.get("socialLinks"):
        update_data["socialLinks"] = update_data["socialLinks"].dict() if hasattr(update_data["socialLinks"], 'dict') else update_data["socialLinks"]
    
    await db.profile.update_one({}, {"$set": update_data})
    profile = await db.profile.find_one()
    return Profile(**{k: v for k, v in profile.items() if k != '_id'})

# ==================== EXPERIENCE ROUTES ====================

@api_router.get("/experiences", response_model=List[Experience])
async def get_experiences():
    experiences = await db.experiences.find().to_list(100)
    return [Experience(**{k: v for k, v in exp.items() if k != '_id'}) for exp in experiences]

@api_router.post("/experiences", response_model=Experience)
async def create_experience(exp: ExperienceCreate, user: dict = Depends(require_auth)):
    experience = Experience(**exp.dict())
    await db.experiences.insert_one(experience.dict())
    return experience

@api_router.put("/experiences/{exp_id}", response_model=Experience)
async def update_experience(exp_id: str, update: ExperienceUpdate, user: dict = Depends(require_auth)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    result = await db.experiences.update_one({"id": exp_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    exp = await db.experiences.find_one({"id": exp_id})
    return Experience(**{k: v for k, v in exp.items() if k != '_id'})

@api_router.delete("/experiences/{exp_id}")
async def delete_experience(exp_id: str, user: dict = Depends(require_auth)):
    result = await db.experiences.delete_one({"id": exp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"success": True}

# ==================== RESEARCH ROUTES ====================

@api_router.get("/research", response_model=List[Research])
async def get_research():
    research_list = await db.research.find().to_list(100)
    return [Research(**{k: v for k, v in r.items() if k != '_id'}) for r in research_list]

@api_router.post("/research", response_model=Research)
async def create_research(research: ResearchCreate, user: dict = Depends(require_auth)):
    new_research = Research(**research.dict())
    await db.research.insert_one(new_research.dict())
    return new_research

@api_router.put("/research/{res_id}", response_model=Research)
async def update_research(res_id: str, update: ResearchUpdate, user: dict = Depends(require_auth)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    result = await db.research.update_one({"id": res_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Research not found")
    res = await db.research.find_one({"id": res_id})
    return Research(**{k: v for k, v in res.items() if k != '_id'})

@api_router.delete("/research/{res_id}")
async def delete_research(res_id: str, user: dict = Depends(require_auth)):
    result = await db.research.delete_one({"id": res_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Research not found")
    return {"success": True}

# ==================== VALIDATOR ROUTES ====================

@api_router.get("/validators", response_model=List[Validator])
async def get_validators():
    validators = await db.validators.find().to_list(100)
    return [Validator(**{k: v for k, v in v.items() if k != '_id'}) for v in validators]

@api_router.post("/validators", response_model=Validator)
async def create_validator(validator: ValidatorCreate, user: dict = Depends(require_auth)):
    new_validator = Validator(**validator.dict())
    await db.validators.insert_one(new_validator.dict())
    return new_validator

@api_router.put("/validators/{val_id}", response_model=Validator)
async def update_validator(val_id: str, update: ValidatorUpdate, user: dict = Depends(require_auth)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    result = await db.validators.update_one({"id": val_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Validator not found")
    val = await db.validators.find_one({"id": val_id})
    return Validator(**{k: v for k, v in val.items() if k != '_id'})

@api_router.delete("/validators/{val_id}")
async def delete_validator(val_id: str, user: dict = Depends(require_auth)):
    result = await db.validators.delete_one({"id": val_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Validator not found")
    return {"success": True}

# ==================== POST ROUTES ====================

@api_router.get("/posts", response_model=List[Post])
async def get_posts(published_only: bool = False):
    query = {"published": True} if published_only else {}
    posts = await db.posts.find(query).sort("date", -1).to_list(100)
    return [Post(**{k: v for k, v in p.items() if k != '_id'}) for p in posts]

@api_router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str):
    post = await db.posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return Post(**{k: v for k, v in post.items() if k != '_id'})

@api_router.post("/posts", response_model=Post)
async def create_post(post: PostCreate, user: dict = Depends(require_auth)):
    new_post = Post(**post.dict())
    await db.posts.insert_one(new_post.dict())
    return new_post

@api_router.put("/posts/{post_id}", response_model=Post)
async def update_post(post_id: str, update: PostUpdate, user: dict = Depends(require_auth)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    result = await db.posts.update_one({"id": post_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    post = await db.posts.find_one({"id": post_id})
    return Post(**{k: v for k, v in post.items() if k != '_id'})

@api_router.delete("/posts/{post_id}")
async def delete_post(post_id: str, user: dict = Depends(require_auth)):
    result = await db.posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"success": True}

# ==================== ROOT ROUTE ====================

@api_router.get("/")
async def root():
    return {"message": "Fahmy Web3 Portfolio API", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
