from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.service_provider import (
    ServiceProviderCreate,
    ServiceProviderResponse,
    ServiceProviderUpdate,
)
from app.services.service_provider import ServiceProviderService


router = APIRouter(
    prefix="/api/v1/service-providers",
    tags=["Service Providers"],
)


@router.post(
    "",
    response_model=ServiceProviderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_service_provider(
    provider_data: ServiceProviderCreate,
    db: Session = Depends(get_db),
):
    service = ServiceProviderService(db)
    return service.create_provider(provider_data)


@router.get(
    "",
    response_model=list[ServiceProviderResponse],
)
def get_service_providers(
    db: Session = Depends(get_db),
):
    service = ServiceProviderService(db)
    return service.get_all_providers()


@router.get(
    "/{provider_id}",
    response_model=ServiceProviderResponse,
)
def get_service_provider(
    provider_id: int,
    db: Session = Depends(get_db),
):
    service = ServiceProviderService(db)
    return service.get_provider(provider_id)


@router.put(
    "/{provider_id}",
    response_model=ServiceProviderResponse,
)
def update_service_provider(
    provider_id: int,
    provider_data: ServiceProviderUpdate,
    db: Session = Depends(get_db),
):
    service = ServiceProviderService(db)
    return service.update_provider(provider_id, provider_data)


@router.delete(
    "/{provider_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_service_provider(
    provider_id: int,
    db: Session = Depends(get_db),
):
    service = ServiceProviderService(db)
    service.delete_provider(provider_id)