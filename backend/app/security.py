import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

import bcrypt
from jose import jwt, JWTError

SECRET_KEY = os.getenv("SECRET_KEY", "honeychain-secret-key-prod-2026-secure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


def hash_password(password: str) -> str:
    """
    Hashes a password using direct bcrypt.
    Safely truncates to 72 bytes as per bcrypt specification.
    """
    pw_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a bcrypt hashed password.
    """
    try:
        pw_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pw_bytes, hash_bytes)
    except Exception:
        return False


def create_access_token(user_id: int, role: str, email: Optional[str] = None, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a signed JWT access token containing subject (user_id), role, and email.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "role": role.upper(),
        "exp": expire,
    }
    if email:
        payload["email"] = email

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a JWT access token. Returns payload dict or None.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None