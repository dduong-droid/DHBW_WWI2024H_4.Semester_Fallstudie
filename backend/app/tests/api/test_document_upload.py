from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_document_upload_accepts_pdf_metadata_without_medical_analysis() -> None:
    response = client.post(
        "/api/documents/upload",
        files={"file": ("arztbrief-demo.pdf", b"%PDF-demo", "application/pdf")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["document_id"].startswith("doc_")
    assert payload["filename"] == "arztbrief-demo.pdf"
    assert payload["content_type"] == "application/pdf"
    assert payload["size"] == len(b"%PDF-demo")
    assert payload["status"] == "uploaded_demo"
    assert payload["analysis_available"] is False
    assert "nicht medizinisch ausgewertet" in payload["note"]


def test_document_upload_rejects_invalid_type() -> None:
    response = client.post(
        "/api/documents/upload",
        files={"file": ("notes.txt", b"demo", "text/plain")},
    )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_document_upload_rejects_too_large_file() -> None:
    response = client.post(
        "/api/documents/upload",
        files={"file": ("large.pdf", b"x" * (10 * 1024 * 1024 + 1), "application/pdf")},
    )

    assert response.status_code == 413
    assert response.json()["error"]["code"] == "http_error"


def test_document_upload_rejects_missing_file() -> None:
    response = client.post("/api/documents/upload")

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"
