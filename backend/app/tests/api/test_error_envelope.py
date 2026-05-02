from __future__ import annotations

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.errors import install_error_handlers


def test_unhandled_errors_use_public_error_envelope_without_stacktrace() -> None:
    app = FastAPI()
    install_error_handlers(app)

    @app.get("/boom")
    def boom() -> None:
        raise RuntimeError("sensitive internal detail")

    client = TestClient(app, raise_server_exceptions=False)
    response = client.get("/boom")

    assert response.status_code == 500
    assert response.json() == {
        "error": {
            "code": "internal_error",
            "message": "Internal server error.",
            "details": None,
        }
    }
