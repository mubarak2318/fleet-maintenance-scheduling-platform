from sqlalchemy.orm import Session

from app.models.maintenance_schedule import MaintenanceSchedule
from app.schemas.maintenance_schedule import (
    MaintenanceScheduleCreate,
    MaintenanceScheduleUpdate,
)


class MaintenanceScheduleRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        schedule_data: MaintenanceScheduleCreate,
    ) -> MaintenanceSchedule:
        schedule = MaintenanceSchedule(
            **schedule_data.model_dump()
        )

        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)

        return schedule

    def get_all(self) -> list[MaintenanceSchedule]:
        return self.db.query(MaintenanceSchedule).all()

    def get_by_id(
        self,
        schedule_id: int,
    ) -> MaintenanceSchedule | None:
        return (
            self.db.query(MaintenanceSchedule)
            .filter(MaintenanceSchedule.id == schedule_id)
            .first()
        )

    def update(
        self,
        schedule: MaintenanceSchedule,
        schedule_data: MaintenanceScheduleUpdate,
    ) -> MaintenanceSchedule:

        update_data = schedule_data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(schedule, field, value)

        self.db.commit()
        self.db.refresh(schedule)

        return schedule

    def delete(
        self,
        schedule: MaintenanceSchedule,
    ) -> None:
        self.db.delete(schedule)
        self.db.commit()