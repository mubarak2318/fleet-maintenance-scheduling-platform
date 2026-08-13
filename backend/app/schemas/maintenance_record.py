from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class MaintenanceRecordCreate(BaseModel):
    schedule_id: int
    vehicle_id: int
    service_provider_id: int | None = None
    performed_by: int
    service_date: date
    work_description: str
    parts_replaced: str | None = None
    cost: float | None = None
    odometer_reading: int | None = None
    remarks: str | None = None


class MaintenanceRecordUpdate(BaseModel):
    service_provider_id: int | None = None
    performed_by: int | None = None
    service_date: date | None = None
    work_description: str | None = None
    parts_replaced: str | None = None
    cost: float | None = None
    odometer_reading: int | None = None
    remarks: str | None = None


class MaintenanceRecordResponse(MaintenanceRecordCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)