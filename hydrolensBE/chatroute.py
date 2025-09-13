from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.get("/start")
def start_chat():
    return {"message": "Welcome to HydroLens Chatbot! Ask me about groundwater data."}

@router.post("/message")
def chat_message(request: ChatRequest):
    try:
        # For now, return a simple response about groundwater
        # In production, you would integrate with an AI service like OpenAI
        user_message = request.message.lower()

        if "groundwater" in user_message or "water" in user_message:
            response = "I can help you with groundwater data analysis. What specific information are you looking for?"
        elif "assessment" in user_message:
            response = "Groundwater assessments typically include water quality, quantity, and sustainability metrics."
        elif "data" in user_message:
            response = "The INGRES portal contains comprehensive groundwater data. I can help you understand the datasets."
        else:
            response = "I'm here to help with groundwater data questions. Try asking about assessments, quality, or data analysis."

        return ChatResponse(response=response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")
