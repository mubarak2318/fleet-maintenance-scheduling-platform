from sqlalchemy.orm import Session

from app.models.maintenance_record import MaintenanceRecord
from app.schemas.maintenance_record import (
    MaintenanceRecordCreate,
    MaintenanceRecordUpdate,
)


class MaintenanceRecordRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        record_data: MaintenanceRecordCreate,
    ) -> MaintenanceRecord:

        record = MaintenanceRecord(
            **record_data.model_dump()
        )

        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)

        return record

    def get_all(self) -> list[MaintenanceRecord]:
        return self.db.query(MaintenanceRecord).all()

    def get_by_id(
        self,
        record_id: int,
    ) -> MaintenanceRecord | None:

        return (
            self.db.query(MaintenanceRecord)
            .filter(MaintenanceRecord.id == record_id)
            .first()
        )

    def update(
        self,
        record: MaintenanceRecord,
        record_data: MaintenanceRecordUpdate,
    ) -> MaintenanceRecord:

        update_data = record_data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(record, field, value)

        self.db.commit()
        self.db.refresh(record)

        return record

    def delete(
        self,
        record: MaintenanceRecord,
    ) -> None:

        self.db.delete(record)
        self.db.commit()