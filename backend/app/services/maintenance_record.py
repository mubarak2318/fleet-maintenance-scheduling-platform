from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.maintenance_record import MaintenanceRecord
from app.repositories.maintenance_record import MaintenanceRecordRepository
from app.schemas.maintenance_record import (
    MaintenanceRecordCreate,
    MaintenanceRecordUpdate,
)


class MaintenanceRecordService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = MaintenanceRecordRepository(db)

    def create_record(
        self,
        record_data: MaintenanceRecordCreate,
    ):
        from app.models.maintenance_schedule import MaintenanceSchedule

        schedule = (
            self.db.query(MaintenanceSchedule)
            .filter(
                MaintenanceSchedule.id == record_data.schedule_id
            )
            .first()
        )

        if schedule is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Maintenance schedule not found.",
            )

        from app.models.vehicle import Vehicle

        vehicle = (
            self.db.query(Vehicle)
            .filter(
                Vehicle.id == record_data.vehicle_id
            )
            .first()
        )

        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found.",
            )

        from app.models.user import User

        user = (
            self.db.query(User)
            .filter(
                User.id == record_data.performed_by
            )
            .first()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User who performed maintenance not found.",
            )

        if record_data.service_provider_id is not None:
            from app.models.service_provider import ServiceProvider

            provider = (
                self.db.query(ServiceProvider)
                .filter(
                    ServiceProvider.id
                    == record_data.service_provider_id
                )
                .first()
            )

            if provider is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Service provider not found.",
                )

        existing_record = (
            self.db.query(MaintenanceRecord)
            .filter(
                MaintenanceRecord.schedule_id
                == record_data.schedule_id
            )
            .first()
        )

        if existing_record is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A maintenance record already exists for this schedule.",
            )

        record = MaintenanceRecord(
            **record_data.model_dump(),
            created_at=datetime.now(timezone.utc),
        )

        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)

        return record

    def get_all_records(self):
        return self.repository.get_all()

    def get_record(self, record_id: int):
        record = self.repository.get_by_id(record_id)

        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Maintenance record not found.",
            )

        return record

    def update_record(
        self,
        record_id: int,
        record_data: MaintenanceRecordUpdate,
    ):
        record = self.get_record(record_id)

        update_data = record_data.model_dump(
            exclude_unset=True
        )

        if "performed_by" in update_data:
            from app.models.user import User

            user = (
                self.db.query(User)
                .filter(
                    User.id == update_data["performed_by"]
                )
                .first()
            )

            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User who performed maintenance not found.",
                )

        if "service_provider_id" in update_data:
            if update_data["service_provider_id"] is not None:
                from app.models.service_provider import ServiceProvider

                provider = (
                    self.db.query(ServiceProvider)
                    .filter(
                        ServiceProvider.id
                        == update_data["service_provider_id"]
                    )
                    .first()
                )

                if provider is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Service provider not found.",
                    )

        for field, value in update_data.items():
            setattr(record, field, value)

        self.db.commit()
        self.db.refresh(record)

        return record

    def delete_record(self, record_id: int):
        record = self.get_record(record_id)
        self.repository.delete(record)