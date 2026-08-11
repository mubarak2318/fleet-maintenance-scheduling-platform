from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.repositories.vehicle import VehicleRepository
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class VehicleService:
    def __init__(self, db: Session):
        self.repository = VehicleRepository(db)

    def create_vehicle(self, vehicle_data: VehicleCreate) -> Vehicle:
        existing_vehicle = self.repository.get_by_registration_number(
            vehicle_data.registration_number
        )

        if existing_vehicle:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Vehicle with this registration number already exists.",
            )

        now = datetime.now(timezone.utc)

        vehicle = Vehicle(
            **vehicle_data.model_dump(),
            created_at=now,
            updated_at=now,
        )

        try:
            return self.repository.create(vehicle)
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Vehicle with this registration number already exists.",
            )

    def get_vehicle(self, vehicle_id: int) -> Vehicle:
        vehicle = self.repository.get_by_id(vehicle_id)

        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found.",
            )

        return vehicle

    def get_all_vehicles(self) -> list[Vehicle]:
        return self.repository.get_all()

    def update_vehicle(
        self,
        vehicle_id: int,
        vehicle_data: VehicleUpdate,
    ) -> Vehicle:
        vehicle = self.get_vehicle(vehicle_id)

        update_data = vehicle_data.model_dump(exclude_unset=True)

        if "registration_number" in update_data:
            existing_vehicle = self.repository.get_by_registration_number(
                update_data["registration_number"]
            )

            if (
                existing_vehicle
                and existing_vehicle.id != vehicle_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Vehicle with this registration number already exists.",
                )

        for field, value in update_data.items():
            setattr(vehicle, field, value)

        vehicle.updated_at = datetime.now(timezone.utc)

        try:
            return self.repository.update(vehicle)
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Vehicle with this registration number already exists.",
            )

    def delete_vehicle(self, vehicle_id: int) -> None:
        vehicle = self.get_vehicle(vehicle_id)
        self.repository.delete(vehicle)