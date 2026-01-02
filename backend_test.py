#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Fahmy Web3 Portfolio
Tests all endpoints including authentication, CRUD operations, and data persistence
"""

import requests
import json
import sys
from typing import Dict, Any, Optional
import uuid

# Configuration
BASE_URL = "https://crypto-profile-2.preview.emergentagent.com/api"
ADMIN_EMAIL = "fahmy@admin.com"
ADMIN_PASSWORD = "admin123"

class APITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.headers = {"Content-Type": "application/json"}
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, auth: bool = False) -> tuple:
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}{endpoint}"
        headers = self.headers.copy()
        
        if auth and self.token:
            headers["Authorization"] = f"Bearer {self.token}"
            
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=30)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data, timeout=30)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                return None, f"Unsupported method: {method}"
                
            return response, None
        except requests.exceptions.RequestException as e:
            return None, str(e)
    
    def test_login(self) -> bool:
        """Test login endpoint and store JWT token"""
        print("\n=== Testing Authentication ===")
        
        login_data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response, error = self.make_request("POST", "/auth/login", login_data)
        
        if error:
            self.log_test("Login API", False, f"Request failed: {error}")
            return False
            
        if response.status_code != 200:
            self.log_test("Login API", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
        try:
            data = response.json()
            if data.get("success") and data.get("token"):
                self.token = data["token"]
                self.log_test("Login API", True, f"Token received, User: {data.get('user', {}).get('name', 'Unknown')}")
                return True
            else:
                self.log_test("Login API", False, f"Login failed: {data.get('error', 'Unknown error')}")
                return False
        except json.JSONDecodeError:
            self.log_test("Login API", False, "Invalid JSON response")
            return False
    
    def test_public_endpoints(self):
        """Test all public GET endpoints"""
        print("\n=== Testing Public Endpoints ===")
        
        public_endpoints = [
            ("/profile", "Profile"),
            ("/experiences", "Experiences"),
            ("/research", "Research"),
            ("/validators", "Validators"),
            ("/posts", "Posts")
        ]
        
        for endpoint, name in public_endpoints:
            response, error = self.make_request("GET", endpoint)
            
            if error:
                self.log_test(f"GET {name}", False, f"Request failed: {error}")
                continue
                
            if response.status_code == 200:
                try:
                    data = response.json()
                    if endpoint == "/profile":
                        # Profile should be a single object
                        if isinstance(data, dict) and data.get("name"):
                            self.log_test(f"GET {name}", True, f"Profile name: {data.get('name')}")
                        else:
                            self.log_test(f"GET {name}", False, "Invalid profile structure")
                    else:
                        # Others should be arrays
                        if isinstance(data, list):
                            self.log_test(f"GET {name}", True, f"Retrieved {len(data)} items")
                        else:
                            self.log_test(f"GET {name}", False, "Expected array response")
                except json.JSONDecodeError:
                    self.log_test(f"GET {name}", False, "Invalid JSON response")
            else:
                self.log_test(f"GET {name}", False, f"Status: {response.status_code}, Response: {response.text}")
    
    def test_protected_profile(self):
        """Test protected profile update endpoint"""
        print("\n=== Testing Protected Profile Endpoint ===")
        
        if not self.token:
            self.log_test("Profile Update", False, "No authentication token available")
            return
            
        # Test profile update
        update_data = {
            "tagline": "Updated Web3 Researcher & Node Validator",
            "location": "Updated Indonesia"
        }
        
        response, error = self.make_request("PUT", "/profile", update_data, auth=True)
        
        if error:
            self.log_test("Profile Update", False, f"Request failed: {error}")
            return
            
        if response.status_code == 200:
            try:
                data = response.json()
                if data.get("tagline") == update_data["tagline"]:
                    self.log_test("Profile Update", True, "Profile updated successfully")
                else:
                    self.log_test("Profile Update", False, "Profile update not reflected")
            except json.JSONDecodeError:
                self.log_test("Profile Update", False, "Invalid JSON response")
        else:
            self.log_test("Profile Update", False, f"Status: {response.status_code}, Response: {response.text}")
    
    def test_experiences_crud(self):
        """Test CRUD operations for experiences"""
        print("\n=== Testing Experiences CRUD ===")
        
        if not self.token:
            self.log_test("Experiences CRUD", False, "No authentication token available")
            return
            
        # Create new experience
        new_experience = {
            "title": "Test Senior Blockchain Developer",
            "company": "Test Web3 Company",
            "period": "2024 - Present",
            "description": "Testing CRUD operations for experience management",
            "tags": ["Testing", "API", "Backend"]
        }
        
        # CREATE
        response, error = self.make_request("POST", "/experiences", new_experience, auth=True)
        
        if error:
            self.log_test("Experience CREATE", False, f"Request failed: {error}")
            return
            
        if response.status_code != 200:
            self.log_test("Experience CREATE", False, f"Status: {response.status_code}, Response: {response.text}")
            return
            
        try:
            created_exp = response.json()
            exp_id = created_exp.get("id")
            if exp_id and created_exp.get("title") == new_experience["title"]:
                self.log_test("Experience CREATE", True, f"Created experience with ID: {exp_id}")
            else:
                self.log_test("Experience CREATE", False, "Invalid response structure")
                return
        except json.JSONDecodeError:
            self.log_test("Experience CREATE", False, "Invalid JSON response")
            return
        
        # UPDATE
        update_data = {
            "title": "Updated Senior Blockchain Developer",
            "description": "Updated description for testing"
        }
        
        response, error = self.make_request("PUT", f"/experiences/{exp_id}", update_data, auth=True)
        
        if error:
            self.log_test("Experience UPDATE", False, f"Request failed: {error}")
        elif response.status_code == 200:
            try:
                updated_exp = response.json()
                if updated_exp.get("title") == update_data["title"]:
                    self.log_test("Experience UPDATE", True, "Experience updated successfully")
                else:
                    self.log_test("Experience UPDATE", False, "Update not reflected")
            except json.JSONDecodeError:
                self.log_test("Experience UPDATE", False, "Invalid JSON response")
        else:
            self.log_test("Experience UPDATE", False, f"Status: {response.status_code}, Response: {response.text}")
        
        # DELETE
        response, error = self.make_request("DELETE", f"/experiences/{exp_id}", auth=True)
        
        if error:
            self.log_test("Experience DELETE", False, f"Request failed: {error}")
        elif response.status_code == 200:
            try:
                result = response.json()
                if result.get("success"):
                    self.log_test("Experience DELETE", True, "Experience deleted successfully")
                else:
                    self.log_test("Experience DELETE", False, "Delete operation failed")
            except json.JSONDecodeError:
                self.log_test("Experience DELETE", False, "Invalid JSON response")
        else:
            self.log_test("Experience DELETE", False, f"Status: {response.status_code}, Response: {response.text}")
    
    def test_validators_crud(self):
        """Test CRUD operations for validators"""
        print("\n=== Testing Validators CRUD ===")
        
        if not self.token:
            self.log_test("Validators CRUD", False, "No authentication token available")
            return
            
        # Create new validator
        new_validator = {
            "network": "Test Network",
            "status": "active",
            "type": "Test Validator",
            "stake": "1000 TEST",
            "uptime": "100%",
            "since": "2024-01",
            "icon": "🧪",
            "color": "#FF5733"
        }
        
        # CREATE
        response, error = self.make_request("POST", "/validators", new_validator, auth=True)
        
        if error:
            self.log_test("Validator CREATE", False, f"Request failed: {error}")
            return
            
        if response.status_code != 200:
            self.log_test("Validator CREATE", False, f"Status: {response.status_code}, Response: {response.text}")
            return
            
        try:
            created_val = response.json()
            val_id = created_val.get("id")
            if val_id and created_val.get("network") == new_validator["network"]:
                self.log_test("Validator CREATE", True, f"Created validator with ID: {val_id}")
            else:
                self.log_test("Validator CREATE", False, "Invalid response structure")
                return
        except json.JSONDecodeError:
            self.log_test("Validator CREATE", False, "Invalid JSON response")
            return
        
        # UPDATE
        update_data = {
            "status": "inactive",
            "uptime": "99.5%"
        }
        
        response, error = self.make_request("PUT", f"/validators/{val_id}", update_data, auth=True)
        
        if error:
            self.log_test("Validator UPDATE", False, f"Request failed: {error}")
        elif response.status_code == 200:
            try:
                updated_val = response.json()
                if updated_val.get("status") == update_data["status"]:
                    self.log_test("Validator UPDATE", True, "Validator updated successfully")
                else:
                    self.log_test("Validator UPDATE", False, "Update not reflected")
            except json.JSONDecodeError:
                self.log_test("Validator UPDATE", False, "Invalid JSON response")
        else:
            self.log_test("Validator UPDATE", False, f"Status: {response.status_code}, Response: {response.text}")
        
        # DELETE
        response, error = self.make_request("DELETE", f"/validators/{val_id}", auth=True)
        
        if error:
            self.log_test("Validator DELETE", False, f"Request failed: {error}")
        elif response.status_code == 200:
            try:
                result = response.json()
                if result.get("success"):
                    self.log_test("Validator DELETE", True, "Validator deleted successfully")
                else:
                    self.log_test("Validator DELETE", False, "Delete operation failed")
            except json.JSONDecodeError:
                self.log_test("Validator DELETE", False, "Invalid JSON response")
        else:
            self.log_test("Validator DELETE", False, f"Status: {response.status_code}, Response: {response.text}")
    
    def test_posts_crud(self):
        """Test CRUD operations for posts"""
        print("\n=== Testing Posts CRUD ===")
        
        if not self.token:
            self.log_test("Posts CRUD", False, "No authentication token available")
            return
            
        # Create new post
        new_post = {
            "title": "Test Blog Post: API Testing",
            "excerpt": "A comprehensive test of the blog post API endpoints",
            "content": "This is a test post created during API testing to verify CRUD operations work correctly.",
            "tags": ["Testing", "API", "Backend", "Blog"],
            "published": True
        }
        
        # CREATE
        response, error = self.make_request("POST", "/posts", new_post, auth=True)
        
        if error:
            self.log_test("Post CREATE", False, f"Request failed: {error}")
            return
            
        if response.status_code != 200:
            self.log_test("Post CREATE", False, f"Status: {response.status_code}, Response: {response.text}")
            return
            
        try:
            created_post = response.json()
            post_id = created_post.get("id")
            if post_id and created_post.get("title") == new_post["title"]:
                self.log_test("Post CREATE", True, f"Created post with ID: {post_id}")
            else:
                self.log_test("Post CREATE", False, "Invalid response structure")
                return
        except json.JSONDecodeError:
            self.log_test("Post CREATE", False, "Invalid JSON response")
            return
        
        # UPDATE
        update_data = {
            "title": "Updated Test Blog Post: API Testing Complete",
            "published": False
        }
        
        response, error = self.make_request("PUT", f"/posts/{post_id}", update_data, auth=True)
        
        if error:
            self.log_test("Post UPDATE", False, f"Request failed: {error}")
        elif response.status_code == 200:
            try:
                updated_post = response.json()
                if updated_post.get("title") == update_data["title"]:
                    self.log_test("Post UPDATE", True, "Post updated successfully")
                else:
                    self.log_test("Post UPDATE", False, "Update not reflected")
            except json.JSONDecodeError:
                self.log_test("Post UPDATE", False, "Invalid JSON response")
        else:
            self.log_test("Post UPDATE", False, f"Status: {response.status_code}, Response: {response.text}")
        
        # DELETE
        response, error = self.make_request("DELETE", f"/posts/{post_id}", auth=True)
        
        if error:
            self.log_test("Post DELETE", False, f"Request failed: {error}")
        elif response.status_code == 200:
            try:
                result = response.json()
                if result.get("success"):
                    self.log_test("Post DELETE", True, "Post deleted successfully")
                else:
                    self.log_test("Post DELETE", False, "Delete operation failed")
            except json.JSONDecodeError:
                self.log_test("Post DELETE", False, "Invalid JSON response")
        else:
            self.log_test("Post DELETE", False, f"Status: {response.status_code}, Response: {response.text}")
    
    def test_auth_protection(self):
        """Test that protected endpoints require authentication"""
        print("\n=== Testing Authentication Protection ===")
        
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        protected_endpoints = [
            ("PUT", "/profile", {"tagline": "test"}),
            ("POST", "/experiences", {"title": "test", "company": "test"}),
            ("POST", "/validators", {"network": "test"}),
            ("POST", "/posts", {"title": "test"})
        ]
        
        for method, endpoint, data in protected_endpoints:
            response, error = self.make_request(method, endpoint, data, auth=False)
            
            if error:
                self.log_test(f"Auth Protection {method} {endpoint}", False, f"Request failed: {error}")
            elif response.status_code == 401:
                self.log_test(f"Auth Protection {method} {endpoint}", True, "Correctly rejected unauthorized request")
            else:
                self.log_test(f"Auth Protection {method} {endpoint}", False, f"Expected 401, got {response.status_code}")
        
        # Restore token
        self.token = original_token
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Fahmy Web3 Portfolio API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test authentication first
        if not self.test_login():
            print("\n❌ Authentication failed - cannot proceed with protected endpoint tests")
            self.print_summary()
            return False
        
        # Test public endpoints
        self.test_public_endpoints()
        
        # Test protected endpoints
        self.test_protected_profile()
        self.test_experiences_crud()
        self.test_validators_crud()
        self.test_posts_crud()
        
        # Test authentication protection
        self.test_auth_protection()
        
        # Print summary
        self.print_summary()
        
        return all(result["success"] for result in self.test_results)
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {total - passed}")
        print(f"📈 Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   ❌ {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)

def main():
    """Main test execution"""
    tester = APITester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print("💥 Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()