from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Profile Model
class SocialLinks(BaseModel):
    twitter: Optional[str] = ""
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    discord: Optional[str] = ""
    telegram: Optional[str] = ""

class Profile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    tagline: str = ""
    bio: str = ""
    avatar: str = ""
    location: str = ""
    email: str = ""
    socialLinks: SocialLinks = Field(default_factory=SocialLinks)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    socialLinks: Optional[SocialLinks] = None

# Experience Model
class Experience(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    period: str = ""
    description: str = ""
    tags: List[str] = []

class ExperienceCreate(BaseModel):
    title: str
    company: str
    period: str = ""
    description: str = ""
    tags: List[str] = []

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

# Research Model
class Research(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    abstract: str = ""
    date: str = ""
    tags: List[str] = []
    link: str = ""
    image: str = ""  # Image URL

class ResearchCreate(BaseModel):
    title: str
    abstract: str = ""
    date: str = ""
    tags: List[str] = []
    link: str = ""
    image: str = ""

class ResearchUpdate(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    date: Optional[str] = None
    tags: Optional[List[str]] = None
    link: Optional[str] = None
    image: Optional[str] = None

# Validator Model
class Validator(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    network: str
    status: str = "active"
    type: str = "Mainnet Validator"
    stake: str = ""
    uptime: str = "99.9%"
    since: str = ""
    icon: str = "◆"
    color: str = "#627EEA"
    image: str = ""  # Image URL

class ValidatorCreate(BaseModel):
    network: str
    status: str = "active"
    type: str = "Mainnet Validator"
    stake: str = ""
    uptime: str = "99.9%"
    since: str = ""
    icon: str = "◆"
    color: str = "#627EEA"
    image: str = ""

class ValidatorUpdate(BaseModel):
    network: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    stake: Optional[str] = None
    uptime: Optional[str] = None
    since: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    image: Optional[str] = None

# Post Model
class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str = ""
    content: str = ""
    date: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    tags: List[str] = []
    published: bool = False
    image: str = ""  # Featured image URL

class PostCreate(BaseModel):
    title: str
    excerpt: str = ""
    content: str = ""
    tags: List[str] = []
    published: bool = False
    image: str = ""

class PostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    published: Optional[bool] = None
    image: Optional[str] = None

# Auth Models
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    user: Optional[dict] = None
    error: Optional[str] = None

# Admin User Model
class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    name: str = "Admin"
    role: str = "admin"
