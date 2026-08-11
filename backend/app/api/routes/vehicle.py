from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate
from app.services.vehicle import VehicleService


router = APIRouter(
    prefix="/api/v1/vehicles",
    tags=["Vehicles"],
)


@router.post(
    "",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
):
    service = VehicleService(db)
    return service.create_vehicle(vehicle_data)


@router.get(
    "",
    response_model=list[VehicleResponse],
)
def get_vehicles(
    db: Session = Depends(get_db),
):
    service = VehicleService(db)
    return service.get_all_vehicles()


@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    service = VehicleService(db)
    return service.get_vehicle(vehicle_id)


@router.put(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def update_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleUpdate,
    db: Session = Depends(get_db),
):
    service = VehicleService(db)
    return service.update_vehicle(vehicle_id, vehicle_data)


@router.delete(
    "/{vehicle_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    service = VehicleService(db)
    service.delete_vehicle(vehicle_id)