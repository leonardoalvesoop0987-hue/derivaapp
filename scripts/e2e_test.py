import requests
import json
import os
import time

BASE_URL = "https://derivalove.duckdns.org"
LP_URL = "https://comprarderivalove.duckdns.org"

session = requests.Session()

def print_result(step, success, msg=""):
    status = "[SUCCESS]" if success else "[FAILED]"
    print(f"{status} {step} {msg}")

def test_multihost():
    try:
        r1 = requests.get(BASE_URL)
        r2 = requests.get(LP_URL)
        # BASE_URL typically redirects or serves the app (contains "Deriva")
        # LP_URL typically rewrites to /lp (contains things about buying)
        print_result("Multi-host PWA", r1.status_code == 200, f"HTTP {r1.status_code}")
        print_result("Multi-host LP", r2.status_code == 200, f"HTTP {r2.status_code}")
    except Exception as e:
        print_result("Multi-host", False, str(e))

def test_auth():
    email = f"audit_user_{int(time.time())}@derivalove.com"
    password = "auditpassword"
    try:
        # Register
        r = session.post(f"{BASE_URL}/api/auth/register", json={"email": email, "password": password})
        if r.status_code == 200 and r.json().get("success"):
            print_result("Auth - Register", True)
        else:
            print_result("Auth - Register", False, r.text)
            return False

        # Logout
        r = session.post(f"{BASE_URL}/api/auth/logout")
        print_result("Auth - Logout", r.status_code == 200)

        # Try access protected app route
        r = session.get(f"{BASE_URL}/app", allow_redirects=False)
        print_result("Auth - Protected Route (Logged Out)", r.status_code in [302, 307, 308], f"Redirects to login: {r.status_code}")

        # Login
        r = session.post(f"{BASE_URL}/api/auth/login", json={"email": email, "password": password})
        if r.status_code == 200 and r.json().get("success"):
            print_result("Auth - Login", True)
        else:
            print_result("Auth - Login", False, r.text)
            return False

        # Try access protected app route
        r = session.get(f"{BASE_URL}/app", allow_redirects=False)
        print_result("Auth - Protected Route (Logged In)", r.status_code == 200, f"HTTP {r.status_code}")
        
        return True
    except Exception as e:
        print_result("Auth", False, str(e))
        return False

def test_session():
    try:
        # Create session
        r = session.post(f"{BASE_URL}/api/session/create", json={
            "mode": "ESTREIA",
            "length": "CURTA",
            "maxIntensity": "INTENSO",
            "videosEnabled": True,
            "musicEnabled": True
        })
        
        if r.status_code != 200:
            print_result("Session - Create", False, r.text)
            return
        
        session_data = r.json()
        print("Session data:", session_data)
        session_id = session_data['id']
        print_result("Session - Create", True, f"ID: {session_id}")

        # Next card (should be Azul)
        r = session.post(f"{BASE_URL}/api/session/next", json={"sessionId": session_id})
        card_data = r.json()
        
        if card_data.get('ended'):
            print_result("Session - Next Card", False, "Session ended immediately")
            return

        print_result("Session - First Card", card_data['card']['color'] == 'AZUL', f"Color: {card_data['card']['color']}")

        # Abort session
        r = session.post(f"{BASE_URL}/api/session/abort", json={"sessionId": session_id})
        print_result("Session - Abort", r.status_code == 200)

    except Exception as e:
        print_result("Session test", False, str(e))

if __name__ == "__main__":
    print("--- STARTING DERIVA PWA E2E AUDIT ---")
    test_multihost()
    if test_auth():
        test_session()
    print("--- AUDIT COMPLETE ---")
