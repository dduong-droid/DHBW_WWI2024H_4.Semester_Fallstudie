"""Security helpers."""

from __future__ import annotations

import os

from fastapi import Header, HTTPException, status


def _configured_api_key() -> str:
    return os.getenv("API_KEY", "")


def require_api_key(x_api_key: str | None = Header(default=None, alias="X-API-Key")) -> None:
    expected_key = _configured_api_key()
    if not expected_key:
        return
    if x_api_key != expected_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid API key.",
        )
