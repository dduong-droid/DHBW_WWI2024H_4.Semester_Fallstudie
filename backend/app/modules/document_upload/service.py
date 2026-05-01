"""Safe demo document upload service.

The MVP intentionally keeps only metadata and never persists medical file
contents. This models the upload boundary without pretending OCR or medical
document analysis exists.
"""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.modules.analytics.service import record_event
from app.modules.document_upload.schemas import DocumentUploadResult


ALLOWED_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/png"}
MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024


async def validate_demo_document_upload(file: UploadFile) -> DocumentUploadResult:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="A filename is required.")
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unsupported document type. Allowed types: PDF, JPG, PNG.",
        )

    size = 0
    while chunk := await file.read(1024 * 1024):
        size += len(chunk)
        if size > MAX_DOCUMENT_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Document exceeds the 10 MB demo upload limit.",
            )

    result = DocumentUploadResult(
        document_id=f"doc_{uuid4().hex[:10]}",
        filename=file.filename,
        content_type=file.content_type,
        size=size,
        created_at=datetime.now(timezone.utc),
    )
    record_event(
        "document_uploaded_demo",
        metadata={
            "document_id": result.document_id,
            "content_type": result.content_type,
            "size": result.size,
            "analysis_available": False,
        },
    )
    return result
