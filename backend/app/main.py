from fastapi import FastAPI

app = FastAPI(
    title="Fleet Maintenance Scheduling Platform",
    version="0.1.0",
    description="Backend API for managing fleet vehicles and maintenance scheduling.",
)


@app.get("/health")
def health_check():
    return {
        "success": True,
        "data": {
            "status": "healthy"
        },
        "message": "Fleet Maintenance API is running."
    }