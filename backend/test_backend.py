#!/usr/bin/env python3
"""
Simple test script to demonstrate FastAPI backend integration
"""

import requests
import json
import time
import subprocess
import os

def test_backend():
    """Test the FastAPI backend endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing HydroLens Chatbot Backend...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/")
        print("✅ Health check:", response.json()["message"])
    except Exception as e:
        print("❌ Health check failed:", str(e))
        return False
    
    # Test model status
    try:
        response = requests.get(f"{base_url}/model-status")
        status = response.json()
        print(f"📊 Model Status: {'Loaded' if status['model_loaded'] else 'Not Loaded'}")
        print(f"📁 Available files: {status['available_files']}")
    except Exception as e:
        print("❌ Model status failed:", str(e))
    
    # Test chat endpoint
    test_messages = [
        "Hello, can you help me?",
        "What is groundwater?",
        "How does HydroLens work?",
        "Tell me about water quality"
    ]
    
    print("\n💬 Testing Chat Responses:")
    print("-" * 30)
    
    for message in test_messages:
        try:
            response = requests.post(
                f"{base_url}/chat",
                headers={"Content-Type": "application/json"},
                json={"message": message}
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"User: {message}")
                print(f"Bot:  {data['reply']}")
                print(f"Model: {'🤖 AI' if data['model_loaded'] else '🎭 Demo'}")
                print()
            else:
                print(f"❌ Chat request failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Chat test failed: {str(e)}")
    
    # Test frontend compatibility endpoint
    try:
        response = requests.post(
            f"{base_url}/api/send-message",
            headers={"Content-Type": "application/json"},
            json={"message": "Testing frontend compatibility"}
        )
        if response.status_code == 200:
            print("✅ Frontend compatibility endpoint working")
        else:
            print("❌ Frontend compatibility endpoint failed")
    except Exception as e:
        print(f"❌ Frontend compatibility test failed: {str(e)}")
    
    print("\n🎯 Backend Testing Complete!")
    print("📝 To test with a real AI model:")
    print("   1. Place your model file in backend/chatbot_model/")
    print("   2. Install model dependencies (torch, transformers, etc.)")
    print("   3. Restart the backend server")
    print("\n🌐 Visit http://localhost:8000/docs for API documentation")
    
    return True

if __name__ == "__main__":
    print("Starting backend test...")
    
    # Check if backend is running
    try:
        requests.get("http://localhost:8000/", timeout=5)
        print("✅ Backend is already running")
    except:
        print("❌ Backend not running. Please start the backend first:")
        print("   cd backend && python main.py")
        exit(1)
    
    test_backend()