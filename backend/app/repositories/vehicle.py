from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle


class VehicleRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, vehicle: Vehicle) -> Vehicle:
        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def get_by_id(self, vehicle_id: int) -> Vehicle | None:
        statement = select(Vehicle).where(Vehicle.id == vehicle_id)
        return self.db.scalar(statement)

    def get_by_registration_number(
        self, registration_number: str
    ) -> Vehicle | None:
        statement = select(Vehicle).where(
            Vehicle.registration_number == registration_number
        )
        return self.db.scalar(statement)

    def get_all(self) -> list[Vehicle]:
        statement = select(Vehicle).order_by(Vehicle.id)
        return list(self.db.scalars(statement).all())

    def update(self, vehicle: Vehicle) -> Vehicle:
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def delete(self, vehicle: Vehicle) -> None:
        self.db.delete(vehicle)
        self.db.commit()