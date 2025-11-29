from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.api.v1.endpoints import map as map_endpoints

app = FastAPI(
    title="GIS Backend API",
    description="GIS Application Backend API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact frontend address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(map_endpoints.router, prefix="/api/v1/map", tags=["Map"])

@app.get("/")
async def root():
    return {"message": "GIS Backend API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

