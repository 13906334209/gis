from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
from pathlib import Path

# 添加 backend 目录到 Python 路径
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.api.v1.endpoints import map as map_endpoints

app = FastAPI(
    title="GIS Backend API",
    description="GIS应用后端API",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该指定具体的前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(map_endpoints.router, prefix="/api/v1/map", tags=["地图"])

@app.get("/")
async def root():
    return {"message": "GIS Backend API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

