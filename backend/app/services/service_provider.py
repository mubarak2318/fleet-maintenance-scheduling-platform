from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.service_provider import ServiceProvider
from app.repositories.service_provider import ServiceProviderRepository
from app.schemas.service_provider import (
    ServiceProviderCreate,
    ServiceProviderUpdate,
)


class ServiceProviderService:

    def __init__(self, db: Session):
        self.repository = ServiceProviderRepository(db)

    def create_provider(
        self,
        provider_data: ServiceProviderCreate,
    ):
        existing_provider = self.repository.get_by_name(
            provider_data.name
        )

        if existing_provider:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Service provider with this name already exists.",
            )

        provider = ServiceProvider(
            **provider_data.model_dump(),
            created_at=datetime.now(timezone.utc),
        )

        self.repository.db.add(provider)
        self.repository.db.commit()
        self.repository.db.refresh(provider)

        return provider

    def get_all_providers(self):
        return self.repository.get_all()

    def get_provider(self, provider_id: int):
        provider = self.repository.get_by_id(provider_id)

        if provider is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service provider not found.",
            )

        return provider

    def update_provider(
        self,
        provider_id: int,
        provider_data: ServiceProviderUpdate,
    ):
        provider = self.get_provider(provider_id)

        if provider_data.name is not None:
            existing_provider = self.repository.get_by_name(
                provider_data.name
            )

            if (
                existing_provider
                and existing_provider.id != provider_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Service provider with this name already exists.",
                )

        return self.repository.update(provider, provider_data)

    def delete_provider(self, provider_id: int):
        provider = self.get_provider(provider_id)
        self.repository.delete(provider)