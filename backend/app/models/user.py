from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        String(50),
        nullable=False,
        default="user",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    # Maintenance schedules assigned to this user
    assigned_schedules = relationship(
        "MaintenanceSchedule",
        back_populates="assigned_user",
        foreign_keys="MaintenanceSchedule.assigned_to",
    )

    # Maintenance records performed by this user
    performed_records = relationship(
        "MaintenanceRecord",
        back_populates="performed_by_user",
        foreign_keys="MaintenanceRecord.performed_by",
    )