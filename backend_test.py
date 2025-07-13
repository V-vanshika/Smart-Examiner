import requests
import sys
import uuid
import os
import time
import json
from datetime import datetime

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

print(f"Using backend URL: {BACKEND_URL}")

class PaperGeniusAPITester:
    def __init__(self):
        self.api_url = BACKEND_URL
        # Generate a unique user ID for testing
        self.test_user_id = str(uuid.uuid4())
        self.folder_id = None
        self.template_id = None
        self.paper_id = None
        self.tests_run = 0
        self.tests_passed = 0
        print(f"Test user ID: {self.test_user_id}")

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, form_data=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files, data=form_data)
                else:
                    response = requests.post(url, json=data, headers=headers)

            print(f"Status code: {response.status_code}")
            
            try:
                response_data = response.json()
                print(f"Response: {json.dumps(response_data, indent=2)}")
            except:
                print(f"Raw response: {response.text}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                return True, response.json() if response.text else {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test the API health check endpoint"""
        success, response = self.run_test(
            "API health check",
            "GET",
            "",
            200
        )
        return success

    def test_create_folder(self):
        """Test creating a folder"""
        folder_data = {
            "name": f"Test Folder {datetime.now().strftime('%H%M%S')}",
            "type": "unit-wise",
            "user_id": self.test_user_id
        }
        success, response = self.run_test(
            "folder creation",
            "POST",
            "api/folders",
            200,
            data=folder_data
        )
        if success and "id" in response:
            self.folder_id = response["id"]
            print(f"✅ Folder created with ID: {self.folder_id}")
        return success

    def test_get_folders(self):
        """Test getting user folders"""
        # Wait a moment to ensure folder is saved
        time.sleep(1)
        success, response = self.run_test(
            "get user folders",
            "GET",
            f"api/folders/{self.test_user_id}",
            200
        )
        if success:
            print(f"✅ Retrieved {len(response)} folders for user")
        return success

    def test_create_template(self):
        """Test creating a template"""
        template_data = {
            "name": f"Test Template {datetime.now().strftime('%H%M%S')}",
            "paper_code": "TEST101",
            "duration": 120,
            "total_marks": 100,
            "sections": [
                {"type": "MCQ", "questions": 10, "marks": 2},
                {"type": "Short", "questions": 5, "marks": 5},
                {"type": "Long", "questions": 3, "marks": 10}
            ],
            "user_id": self.test_user_id
        }
        success, response = self.run_test(
            "template creation",
            "POST",
            "api/templates",
            200,
            data=template_data
        )
        if success and "id" in response:
            self.template_id = response["id"]
            print(f"✅ Template created with ID: {self.template_id}")
        return success

    def test_get_templates(self):
        """Test getting user templates"""
        # Wait a moment to ensure template is saved
        time.sleep(1)
        success, response = self.run_test(
            "get user templates",
            "GET",
            f"api/templates/{self.test_user_id}",
            200
        )
        if success:
            print(f"✅ Retrieved {len(response)} templates for user")
        return success

    def test_upload_file(self):
        """Test file upload"""
        if not self.folder_id:
            print("❌ Skipping file upload test - Folder ID not available")
            return False
        
        # Create a simple text file for testing
        test_file_path = "/tmp/test_content.txt"
        with open(test_file_path, "w") as f:
            f.write("""
            # Introduction to Computer Science
            
            Computer science is the study of computation, automation, and information.
            Computer science spans theoretical disciplines (such as algorithms, theory of computation, and information theory) 
            to practical disciplines (including the design and implementation of hardware and software).
            
            ## Key Topics
            
            1. Algorithms and Data Structures
            2. Programming Languages
            3. Computer Architecture
            4. Operating Systems
            5. Databases
            6. Artificial Intelligence
            7. Machine Learning
            8. Computer Networks
            
            ## Learning Objectives
            
            - Understand fundamental computing concepts
            - Develop problem-solving skills
            - Learn programming techniques
            - Apply computational thinking to real-world problems
            """)
        
        files = {"file": open(test_file_path, "rb")}
        form_data = {"unit_name": "Unit 1: Introduction"}
        
        success, response = self.run_test(
            "file upload",
            "POST",
            f"api/upload/{self.folder_id}",
            200,
            files=files,
            form_data=form_data
        )
        
        # Close and remove the file
        files["file"].close()
        os.remove(test_file_path)
        
        if success and "file_id" in response:
            print(f"✅ File uploaded with ID: {response['file_id']}")
        return success

    def test_generate_paper(self):
        """Test generating a question paper"""
        if not self.folder_id or not self.template_id:
            print("❌ Skipping paper generation test - Folder ID or Template ID not available")
            return False
        
        # Wait to ensure file upload is processed
        time.sleep(2)
        
        paper_data = {
            "folder_id": self.folder_id,
            "template_id": self.template_id,
            "selected_units": ["Unit 1: Introduction"],
            "paper_name": f"Test Paper {datetime.now().strftime('%H%M%S')}",
            "user_id": self.test_user_id
        }
        
        success, response = self.run_test(
            "question paper generation",
            "POST",
            "api/generate-paper",
            200,
            data=paper_data
        )
        
        if success and "id" in response:
            self.paper_id = response["id"]
            print(f"✅ Paper generated with ID: {self.paper_id}")
        return success

    def test_get_papers(self):
        """Test getting user papers"""
        if not self.paper_id:
            print("❌ Skipping get papers test - Paper ID not available")
            return False
            
        # Wait to ensure paper is saved
        time.sleep(1)
        
        success, response = self.run_test(
            "get user papers",
            "GET",
            f"api/papers/{self.test_user_id}",
            200
        )
        
        if success:
            print(f"✅ Retrieved {len(response)} papers for user")
        return success

    def test_get_paper_details(self):
        """Test getting paper details"""
        if not self.paper_id:
            print("❌ Skipping paper details test - Paper ID not available")
            return False
            
        success, response = self.run_test(
            "get paper details",
            "GET",
            f"api/paper/{self.paper_id}",
            200
        )
        
        if success and "questions" in response:
            print(f"✅ Retrieved paper details with {len(response['questions'])} questions")
        return success

    def run_all_tests(self):
        """Run all tests in sequence"""
        tests = [
            self.test_health_check,
            self.test_create_folder,
            self.test_get_folders,
            self.test_create_template,
            self.test_get_templates,
            self.test_upload_file,
            self.test_generate_paper,
            self.test_get_papers,
            self.test_get_paper_details
        ]
        
        for test in tests:
            test()
        
        print(f"\n📊 Tests passed: {self.tests_passed}/{self.tests_run}")
        return self.tests_passed == self.tests_run

if __name__ == "__main__":
    tester = PaperGeniusAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)
