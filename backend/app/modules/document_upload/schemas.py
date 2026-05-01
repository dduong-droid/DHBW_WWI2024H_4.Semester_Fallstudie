"""Schemas for safe demo document metadata uploads."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


DocumentUploadStatus = Literal["uploaded_demo"]


class DocumentUploadResult(BaseModel):
    document_id: str
    filename: str
    content_type: str
    size: int = Field(ge=0)
    status: DocumentUploadStatus = "uploaded_demo"
    analysis_available: bool = False
    note: str = "Dokumente werden im MVP nicht medizinisch ausgewertet."
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
