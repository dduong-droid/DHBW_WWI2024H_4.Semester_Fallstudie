"""Database model definitions."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class PatientProfileRecord(Base):
    __tablename__ = "patient_profiles"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    patient_id: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    status: Mapped[str | None] = mapped_column(String(40), nullable=True)
    payload: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


class QuestionnaireRecord(Base):
    __tablename__ = "questionnaire_intakes"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    patient_id: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    status: Mapped[str | None] = mapped_column(String(40), nullable=True)
    payload: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


class RecommendationRecord(Base):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    patient_id: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    status: Mapped[str | None] = mapped_column(String(40), nullable=True)
    payload: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


class OrderRecord(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    patient_id: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    status: Mapped[str | None] = mapped_column(String(40), nullable=True)
    payload: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


class TrackingRecord(Base):
    __tablename__ = "frontend_tracking"

    patient_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    daily_payload: Mapped[str | None] = mapped_column(Text, nullable=True)
    hydration_payload: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
