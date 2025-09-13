from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

from hydrolensBE import api

app = FastAPI(
    title="HydroLens Backend API",
    description="Python backend for HydroLens groundwater analysis platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://tiyasha-paul.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/auth")

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"message": "HydroLens Python Backend API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "python-backend"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Chat endpoint for groundwater analysis questions
    """
    try:
        # Simple response for now - can be enhanced with actual AI integration
        user_message = request.message.lower()

        if "groundwater" in user_message or "water" in user_message:
            response = "Groundwater is a crucial resource for drinking water and irrigation. Key factors include water quality, recharge rates, and contamination sources."
        elif "quality" in user_message:
            response = "Water quality parameters include pH, turbidity, dissolved solids, and contaminant levels like nitrates and heavy metals."
        elif "analysis" in user_message:
            response = "Groundwater analysis involves monitoring wells, chemical testing, and data interpretation to assess water availability and quality."
        else:
            response = "I'm here to help with groundwater data analysis and water quality questions. What specific information are you looking for?"

        return ChatResponse(response=response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")

@app.get("/docs")
async def docs():
    return {
        "title": "HydroLens Python API Documentation",
        "version": "1.0.0",
        "endpoints": {
            "GET /": "API root information",
            "GET /health": "Health check",
            "POST /api/chat": "Chat endpoint for groundwater queries"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
