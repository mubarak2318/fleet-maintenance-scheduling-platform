from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.maintenance_schedule import MaintenanceSchedule
from app.repositories.maintenance_schedule import MaintenanceScheduleRepository
from app.schemas.maintenance_schedule import (
    MaintenanceScheduleCreate,
    MaintenanceScheduleUpdate,
)


class MaintenanceScheduleService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = MaintenanceScheduleRepository(db)

    def create_schedule(
        self,
        schedule_data: MaintenanceScheduleCreate,
    ):
        # Check vehicle
        from app.models.vehicle import Vehicle

        vehicle = (
            self.db.query(Vehicle)
            .filter(Vehicle.id == schedule_data.vehicle_id)
            .first()
        )

        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found.",
            )

        # Check assigned user
        from app.models.user import User

        user = (
            self.db.query(User)
            .filter(User.id == schedule_data.assigned_to)
            .first()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assigned user not found.",
            )

        # Check service provider if supplied
        if schedule_data.service_provider_id is not None:
            from app.models.service_provider import ServiceProvider

            provider = (
                self.db.query(ServiceProvider)
                .filter(
                    ServiceProvider.id
                    == schedule_data.service_provider_id
                )
                .first()
            )

            if provider is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Service provider not found.",
                )

        schedule = MaintenanceSchedule(
            **schedule_data.model_dump(),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)

        return schedule

    def get_all_schedules(self):
        return self.repository.get_all()

    def get_schedule(self, schedule_id: int):
        schedule = self.repository.get_by_id(schedule_id)

        if schedule is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Maintenance schedule not found.",
            )

        return schedule

    def update_schedule(
        self,
        schedule_id: int,
        schedule_data: MaintenanceScheduleUpdate,
    ):
        schedule = self.get_schedule(schedule_id)

        update_data = schedule_data.model_dump(
            exclude_unset=True
        )

        # Validate vehicle if being changed
        if "vehicle_id" in update_data:
            from app.models.vehicle import Vehicle

            vehicle = (
                self.db.query(Vehicle)
                .filter(
                    Vehicle.id == update_data["vehicle_id"]
                )
                .first()
            )

            if vehicle is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Vehicle not found.",
                )

        # Validate assigned user if being changed
        if "assigned_to" in update_data:
            from app.models.user import User

            user = (
                self.db.query(User)
                .filter(
                    User.id == update_data["assigned_to"]
                )
                .first()
            )

            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Assigned user not found.",
                )

        # Validate service provider if being changed
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
            setattr(schedule, field, value)

        schedule.updated_at = datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(schedule)

        return schedule

    def delete_schedule(self, schedule_id: int):
        schedule = self.get_schedule(schedule_id)
        self.repository.delete(schedule)