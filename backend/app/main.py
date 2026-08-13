from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.service_provider import router as service_provider_router
from app.api.routes.vehicle import router as vehicle_router
from app.api.routes.auth import router as auth_router
from app.api.routes.maintenance_schedule import (
    router as maintenance_schedule_router,
)
from app.api.routes.maintenance_record import (
    router as maintenance_record_router,
)
app = FastAPI(
    title="Fleet Maintenance Scheduling Platform",
    version="0.1.0",
    description="Backend API for managing fleet vehicles and maintenance scheduling.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicle_router)
app.include_router(service_provider_router)
app.include_router(maintenance_schedule_router)
app.include_router(maintenance_record_router)
app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {
        "success": True,
        "data": {
            "status": "healthy"
        },
        "message": "Fleet Maintenance API is running."
    }
