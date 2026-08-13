from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class MaintenanceScheduleBase(BaseModel):
    vehicle_id: int
    assigned_to: int
    service_provider_id: int | None = None
    maintenance_type: str = Field(min_length=1, max_length=100)
    description: str | None = None
    scheduled_date: date
    priority: str = Field(min_length=1, max_length=20)
    status: str = Field(min_length=1, max_length=30)


class MaintenanceScheduleCreate(MaintenanceScheduleBase):
    pass


class MaintenanceScheduleUpdate(BaseModel):
    vehicle_id: int | None = None
    assigned_to: int | None = None
    service_provider_id: int | None = None
    maintenance_type: str | None = Field(
        default=None, min_length=1, max_length=100
    )
    description: str | None = None
    scheduled_date: date | None = None
    priority: str | None = Field(
        default=None, min_length=1, max_length=20
    )
    status: str | None = Field(
        default=None, min_length=1, max_length=30
    )


class MaintenanceScheduleResponse(MaintenanceScheduleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)