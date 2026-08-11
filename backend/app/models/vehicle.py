from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    registration_number: Mapped[str] = mapped_column(
        String(50), nullable=False, unique=True
    )
    vehicle_type: Mapped[str] = mapped_column(String(50), nullable=False)
    make: Mapped[str] = mapped_column(String(100), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    manufacture_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    current_status: Mapped[str] = mapped_column(String(30), nullable=False)
    odometer_reading: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=0,
        server_default="0",
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    maintenance_schedules = relationship(
        "MaintenanceSchedule",
        back_populates="vehicle",
    )

    maintenance_records = relationship(
        "MaintenanceRecord",
        back_populates="vehicle",
    )