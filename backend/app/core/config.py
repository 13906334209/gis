from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application configuration"""
    app_name: str = "GIS Backend API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"

settings = Settings()

