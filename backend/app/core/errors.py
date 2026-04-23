"""Application error handling."""

from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def _code_for_status(status_code: int) -> str:
    if status_code == status.HTTP_401_UNAUTHORIZED:
        return "unauthorized"
    if status_code == status.HTTP_404_NOT_FOUND:
        return "not_found"
    if status_code == status.HTTP_422_UNPROCESSABLE_CONTENT:
        return "validation_error"
    return "http_error"


def _error_payload(*, code: str, message: str, details: object | None = None) -> dict[str, object]:
    return {
        "error": {
            "code": code,
            "message": message,
            "details": jsonable_encoder(details),
        }
    }


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
        message = exc.detail if isinstance(exc.detail, str) else "Request failed."
        details = None if isinstance(exc.detail, str) else exc.detail
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload(
                code=_code_for_status(exc.status_code),
                message=message,
                details=details,
            ),
            headers=exc.headers,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            content=_error_payload(
                code="validation_error",
                message="Request validation failed.",
                details=exc.errors(),
            ),
        )
