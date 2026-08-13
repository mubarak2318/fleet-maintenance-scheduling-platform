from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.maintenance_record import (
    MaintenanceRecordCreate,
    MaintenanceRecordResponse,
    MaintenanceRecordUpdate,
)
from app.services.maintenance_record import MaintenanceRecordService


router = APIRouter(
    prefix="/api/v1/maintenance-records",
    tags=["Maintenance Records"],
)


@router.post(
    "",
    response_model=MaintenanceRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_maintenance_record(
    record_data: MaintenanceRecordCreate,
    db: Session = Depends(get_db),
):
    service = MaintenanceRecordService(db)

    return service.create_record(record_data)


@router.get(
    "",
    response_model=list[MaintenanceRecordResponse],
)
def get_maintenance_records(
    db: Session = Depends(get_db),
):
    service = MaintenanceRecordService(db)

    return service.get_all_records()


@router.get(
    "/{record_id}",
    response_model=MaintenanceRecordResponse,
)
def get_maintenance_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    service = MaintenanceRecordService(db)

    return service.get_record(record_id)


@router.put(
    "/{record_id}",
    response_model=MaintenanceRecordResponse,
)
def update_maintenance_record(
    record_id: int,
    record_data: MaintenanceRecordUpdate,
    db: Session = Depends(get_db),
):
    service = MaintenanceRecordService(db)

    return service.update_record(
        record_id,
        record_data,
    )


@router.delete(
    "/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_maintenance_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    service = MaintenanceRecordService(db)

    service.delete_record(record_id)