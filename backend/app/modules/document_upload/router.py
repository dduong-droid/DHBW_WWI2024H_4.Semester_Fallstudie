"""Document upload router for safe MVP metadata handling."""

from fastapi import APIRouter, File, UploadFile

from app.modules.document_upload.schemas import DocumentUploadResult
from app.modules.document_upload.service import validate_demo_document_upload


router = APIRouter()


@router.post("/documents/upload", response_model=DocumentUploadResult)
async def upload_document(file: UploadFile = File(...)) -> DocumentUploadResult:
    return await validate_demo_document_upload(file)
