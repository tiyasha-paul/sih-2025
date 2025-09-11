from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
import sys

# Add the utils directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))

from utils.inference import get_chatbot_response, get_model_status

# Initialize FastAPI app
app = FastAPI(
    title="HydroLens Chatbot API",
    description="FastAPI backend for HydroLens chatbot with AI model integration",
    version="1.0.0"
)

# Configure CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    model_loaded: bool = False
    
    class Config:
        protected_namespaces = ()

class ModelStatusResponse(BaseModel):
    model_loaded: bool
    model_type: Optional[str]
    model_dir: str
    available_files: list
    
    class Config:
        protected_namespaces = ()

# Health check endpoint
@app.get("/")
async def health_check():
    """Health check endpoint to verify the API is running."""
    return {
        "status": "healthy",
        "message": "HydroLens Chatbot API is running",
        "endpoints": {
            "chat": "/chat",
            "model_status": "/model-status",
            "docs": "/docs"
        }
    }

# Main chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """
    Main chat endpoint for receiving user messages and returning chatbot responses.
    
    This endpoint:
    1. Accepts user messages from the frontend
    2. Processes them through the AI model (if available)
    3. Returns appropriate responses
    
    Args:
        chat_message (ChatMessage): Contains the user's message
        
    Returns:
        ChatResponse: Contains the chatbot's reply and model status
    """
    try:
        if not chat_message.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Get response from the chatbot inference engine
        response = get_chatbot_response(chat_message.message)
        
        # Get model status
        model_info = get_model_status()
        
        return ChatResponse(
            reply=response,
            model_loaded=model_info["model_loaded"]
        )
        
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error in chat endpoint: {e}")
        
        # Return a fallback response
        return ChatResponse(
            reply="I'm sorry, I encountered an error processing your message. Please try again.",
            model_loaded=False
        )

# Model status endpoint
@app.get("/model-status", response_model=ModelStatusResponse)
async def model_status_endpoint():
    """
    Get information about the current model status.
    
    This endpoint provides information about:
    - Whether a model is loaded
    - Type of model (if any)
    - Available model files
    - Model directory path
    
    Returns:
        ModelStatusResponse: Current model status and information
    """
    try:
        model_info = get_model_status()
        return ModelStatusResponse(**model_info)
    except Exception as e:
        print(f"Error getting model status: {e}")
        return ModelStatusResponse(
            model_loaded=False,
            model_type=None,
            model_dir="chatbot_model",
            available_files=[]
        )

# Alternative endpoint for compatibility with existing frontend
@app.post("/api/send-message", response_model=ChatResponse)
async def send_message_endpoint(chat_message: ChatMessage):
    """
    Alternative endpoint for compatibility with existing frontend code.
    
    This endpoint mirrors the /chat endpoint but uses the path expected
    by the current frontend JavaScript code.
    """
    return await chat_endpoint(chat_message)

# Documentation endpoint with setup instructions
@app.get("/setup-instructions")
async def setup_instructions():
    """
    Provides instructions for setting up the chatbot model.
    """
    return {
        "title": "HydroLens Chatbot Model Setup",
        "instructions": [
            "1. Train your chatbot model using your preferred framework (scikit-learn, PyTorch, Hugging Face, etc.)",
            "2. Save your model in one of these formats:",
            "   - .pkl file for scikit-learn or pickle models",
            "   - .pt file for PyTorch models", 
            "   - Hugging Face model files (config.json, pytorch_model.bin, tokenizer files)",
            "3. Place your model file(s) in the 'backend/chatbot_model/' directory",
            "4. Install required dependencies in requirements.txt (uncomment model-specific packages)",
            "5. Restart the FastAPI server",
            "6. The model will be automatically loaded and ready for inference"
        ],
        "supported_formats": {
            "pickle": "Scikit-learn models, custom pickle objects (.pkl)",
            "pytorch": "PyTorch models (.pt files)",
            "huggingface": "Hugging Face transformers models (directory with config.json)"
        },
        "current_status": get_model_status()
    }

if __name__ == "__main__":
    # Run the server
    print("Starting HydroLens Chatbot API...")
    print("Place your trained model in 'backend/chatbot_model/' directory")
    print("Visit http://localhost:8000/docs for API documentation")
    print("Visit http://localhost:8000/setup-instructions for model setup guide")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )