from fastapi import FastAPI

from app.api.routes.vehicle import router as vehicle_router


app = FastAPI(
    title="Fleet Maintenance Scheduling Platform",
    version="0.1.0",
    description="Backend API for managing fleet vehicles and maintenance scheduling.",
)


app.include_router(vehicle_router)


@app.get("/health")
def health_check():
    return {
        "success": True,
        "data": {
            "status": "healthy"
        },
        "message": "Fleet Maintenance API is running."
    }