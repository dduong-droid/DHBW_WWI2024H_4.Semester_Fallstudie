"""Application entrypoint."""

from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.core.errors import install_error_handlers
from app.db.session import init_db


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)
install_error_handlers(app)
app.include_router(api_router)
init_db()
