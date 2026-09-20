from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    postgres_db: str = "fleet_maintenance"
    postgres_user: str = "fleet_admin"
    postgres_password: str = "fleet_dev_password"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    database_url: str | None = None
    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()