from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.maintenance_schedule import (
    MaintenanceScheduleCreate,
    MaintenanceScheduleResponse,
    MaintenanceScheduleUpdate,
)
from app.services.maintenance_schedule import MaintenanceScheduleService


router = APIRouter(
    prefix="/api/v1/maintenance-schedules",
    tags=["Maintenance Schedules"],
)


@router.post(
    "",
    response_model=MaintenanceScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_maintenance_schedule(
    schedule_data: MaintenanceScheduleCreate,
    db: Session = Depends(get_db),
):
    service = MaintenanceScheduleService(db)
    return service.create_schedule(schedule_data)


@router.get(
    "",
    response_model=list[MaintenanceScheduleResponse],
)
def get_maintenance_schedules(
    db: Session = Depends(get_db),
):
    service = MaintenanceScheduleService(db)
    return service.get_all_schedules()


@router.get(
    "/{schedule_id}",
    response_model=MaintenanceScheduleResponse,
)
def get_maintenance_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
):
    service = MaintenanceScheduleService(db)
    return service.get_schedule(schedule_id)


@router.put(
    "/{schedule_id}",
    response_model=MaintenanceScheduleResponse,
)
def update_maintenance_schedule(
    schedule_id: int,
    schedule_data: MaintenanceScheduleUpdate,
    db: Session = Depends(get_db),
):
    service = MaintenanceScheduleService(db)
    return service.update_schedule(
        schedule_id,
        schedule_data,
    )


@router.delete(
    "/{schedule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_maintenance_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
):
    service = MaintenanceScheduleService(db)
    service.delete_schedule(schedule_id)