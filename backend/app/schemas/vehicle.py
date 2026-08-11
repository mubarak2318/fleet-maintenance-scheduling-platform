from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VehicleBase(BaseModel):
    registration_number: str = Field(min_length=1, max_length=50)
    vehicle_type: str = Field(min_length=1, max_length=50)
    make: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    manufacture_year: int | None = None
    current_status: str = Field(min_length=1, max_length=30)
    odometer_reading: int = Field(default=0, ge=0)


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    registration_number: str | None = Field(
        default=None, min_length=1, max_length=50
    )
    vehicle_type: str | None = Field(
        default=None, min_length=1, max_length=50
    )
    make: str | None = Field(default=None, min_length=1, max_length=100)
    model: str | None = Field(default=None, min_length=1, max_length=100)
    manufacture_year: int | None = None
    current_status: str | None = Field(
        default=None, min_length=1, max_length=30
    )
    odometer_reading: int | None = Field(default=None, ge=0)


class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)