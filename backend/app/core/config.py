"""Application configuration."""

from dataclasses import dataclass
import os


def _csv_env(name: str, default: str) -> tuple[str, ...]:
    return tuple(item.strip() for item in os.getenv(name, default).split(",") if item.strip())


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "Food 4 Recovery Backend")
    app_env: str = os.getenv("APP_ENV", "development")
    app_port: int = int(os.getenv("APP_PORT", "8000"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./food4recovery.db")
    api_key: str = os.getenv("API_KEY", "")
    google_maps_api_key: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    frontend_origins: tuple[str, ...] = _csv_env(
        "FRONTEND_ORIGINS",
        "http://127.0.0.1:3000,http://localhost:3000",
    )


settings = Settings()
