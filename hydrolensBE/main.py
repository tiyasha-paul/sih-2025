from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from hydrolensBE import api
from hydrolensBE import chatroute

app = FastAPI(title="HydroLens API", description="API for HydroLens groundwater data platform")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:5500"],  # Frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/auth")
app.include_router(chatroute.router, prefix="/chat")

@app.get("/")
def root():
    return {"message": "HydroLens API is running"}
