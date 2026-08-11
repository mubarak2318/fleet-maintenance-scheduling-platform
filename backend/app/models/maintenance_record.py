from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    schedule_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("maintenance_schedules.id"),
        nullable=False,
        unique=True,
    )

    vehicle_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("vehicles.id"),
        nullable=False,
    )

    service_provider_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey("service_providers.id"),
        nullable=True,
    )

    performed_by: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False,
    )

    service_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    work_description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    parts_replaced: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    cost: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )

    odometer_reading: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    remarks: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    schedule = relationship(
        "MaintenanceSchedule",
        back_populates="maintenance_record",
    )

    vehicle = relationship(
        "Vehicle",
        back_populates="maintenance_records",
    )

    service_provider = relationship(
        "ServiceProvider",
        back_populates="maintenance_records",
    )

    performed_by_user = relationship(
        "User",
        back_populates="performed_records",
        foreign_keys=[performed_by],
    )