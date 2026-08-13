from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ServiceProviderBase(BaseModel):
    name: str
    contact_person: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    is_active: bool = True


class ServiceProviderCreate(ServiceProviderBase):
    pass


class ServiceProviderUpdate(BaseModel):
    name: str | None = None
    contact_person: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    is_active: bool | None = None


class ServiceProviderResponse(ServiceProviderBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)