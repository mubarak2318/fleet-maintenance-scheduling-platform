from sqlalchemy.orm import Session

from app.models.service_provider import ServiceProvider
from app.schemas.service_provider import (
    ServiceProviderCreate,
    ServiceProviderUpdate,
)


class ServiceProviderRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, provider_data: ServiceProviderCreate) -> ServiceProvider:
        provider = ServiceProvider(**provider_data.model_dump())

        self.db.add(provider)
        self.db.commit()
        self.db.refresh(provider)

        return provider

    def get_all(self) -> list[ServiceProvider]:
        return self.db.query(ServiceProvider).all()

    def get_by_id(self, provider_id: int) -> ServiceProvider | None:
        return (
            self.db.query(ServiceProvider)
            .filter(ServiceProvider.id == provider_id)
            .first()
        )

    def get_by_name(self, name: str) -> ServiceProvider | None:
        return (
            self.db.query(ServiceProvider)
            .filter(ServiceProvider.name == name)
            .first()
        )

    def update(
        self,
        provider: ServiceProvider,
        provider_data: ServiceProviderUpdate,
    ) -> ServiceProvider:

        update_data = provider_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(provider, field, value)

        self.db.commit()
        self.db.refresh(provider)

        return provider

    def delete(self, provider: ServiceProvider) -> None:
        self.db.delete(provider)
        self.db.commit()