from datetime import date, datetime

from sqlalchemy import BigInteger, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class MaintenanceSchedule(Base):
    __tablename__ = "maintenance_schedules"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    vehicle_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("vehicles.id"),
        nullable=False,
    )

    assigned_to: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False,
    )

    service_provider_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey("service_providers.id"),
        nullable=True,
    )

    maintenance_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    scheduled_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    priority: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    vehicle = relationship(
        "Vehicle",
        back_populates="maintenance_schedules",
    )

    assigned_user = relationship(
        "User",
        back_populates="assigned_schedules",
        foreign_keys=[assigned_to],
    )

    service_provider = relationship(
        "ServiceProvider",
        back_populates="maintenance_schedules",
    )

    maintenance_record = relationship(
        "MaintenanceRecord",
        back_populates="schedule",
        uselist=False,
    )