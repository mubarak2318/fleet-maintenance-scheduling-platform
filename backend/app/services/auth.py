from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        name: str,
        email: str,
        password: str,
    ):

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise ValueError(
                "Email is already registered."
            )

        hashed_password = hash_password(password)

        user = User(
            name=name,
            email=email,
            password_hash=hashed_password,
            role="user",
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user


    @staticmethod
    def login_user(
        db: Session,
        email: str,
        password: str,
    ):

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            return None

        if not verify_password(
            password,
            user.password_hash,
        ):
            return None

        if not user.is_active:
            return None

        token = create_access_token(
            user_id=user.id,
            email=user.email,
            role=user.role,
        )

        return user, token