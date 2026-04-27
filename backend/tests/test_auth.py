"""
Backend API tests for Food Delivery App
Tests: Auth endpoints (GET /api/auth/me, POST /api/auth/logout)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    pytest.skip("EXPO_PUBLIC_BACKEND_URL not set", allow_module_level=True)

TEST_SESSION_TOKEN = "test_session_feast_1777324392665"
TEST_USER_ID = "test-user-feast123"
TEST_EMAIL = "testfeast@example.com"


class TestAuthEndpoints:
    """Test authentication endpoints"""

    def test_get_me_with_bearer_token(self):
        """Test GET /api/auth/me with Authorization Bearer token"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {TEST_SESSION_TOKEN}"}
        )
        print(f"GET /api/auth/me status: {response.status_code}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

        data = response.json()
        print(f"Response data: {data}")
        assert "user_id" in data, "Response missing user_id"
        assert "email" in data, "Response missing email"
        assert "name" in data, "Response missing name"
        assert data["user_id"] == TEST_USER_ID, f"Expected user_id {TEST_USER_ID}, got {data['user_id']}"
        assert data["email"] == TEST_EMAIL, f"Expected email {TEST_EMAIL}, got {data['email']}"
        print("✓ GET /api/auth/me with Bearer token passed")

    def test_get_me_with_cookie(self):
        """Test GET /api/auth/me with session cookie"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            cookies={"session_token": TEST_SESSION_TOKEN}
        )
        print(f"GET /api/auth/me (cookie) status: {response.status_code}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

        data = response.json()
        assert data["user_id"] == TEST_USER_ID
        assert data["email"] == TEST_EMAIL
        print("✓ GET /api/auth/me with cookie passed")

    def test_get_me_without_auth(self):
        """Test GET /api/auth/me without authentication should return 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        print(f"GET /api/auth/me (no auth) status: {response.status_code}")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ GET /api/auth/me without auth returns 401")

    def test_get_me_with_invalid_token(self):
        """Test GET /api/auth/me with invalid token should return 401"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid_token_12345"}
        )
        print(f"GET /api/auth/me (invalid token) status: {response.status_code}")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ GET /api/auth/me with invalid token returns 401")

    def test_logout_endpoint(self):
        """Test POST /api/auth/logout"""
        response = requests.post(
            f"{BASE_URL}/api/auth/logout",
            headers={"Authorization": f"Bearer {TEST_SESSION_TOKEN}"}
        )
        print(f"POST /api/auth/logout status: {response.status_code}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

        data = response.json()
        assert "message" in data
        print(f"Logout response: {data}")
        print("✓ POST /api/auth/logout passed")

    def test_api_root(self):
        """Test GET /api/ root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        print(f"GET /api/ status: {response.status_code}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"

        data = response.json()
        assert "message" in data
        print(f"API root response: {data}")
        print("✓ GET /api/ passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
