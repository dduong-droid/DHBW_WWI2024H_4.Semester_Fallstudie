"""Application configuration."""

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "Food 4 Recovery Backend")
    app_env: str = os.getenv("APP_ENV", "development")
    app_port: int = int(os.getenv("APP_PORT", "8000"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./food4recovery.db")
    api_key: str = os.getenv("API_KEY", "")


settings = Settings()
