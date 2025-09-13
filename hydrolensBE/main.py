import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from hydrolensBE import api
from hydrolensBE import chatroute
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="HydroLens API", description="API for HydroLens groundwater data platform")

# Get allowed origins from environment variables
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500").split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom error handler
@app.exception_handler(Exception)
async def validation_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": f"An unexpected error occurred: {exc}"},
    )

app.include_router(api.router, prefix="/auth")
app.include_router(chatroute.router, prefix="/chat")

@app.get("/")
def root():
    return {"message": "HydroLens API is running"}
