import os
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from fastapi import Header

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretjwt")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


def hash_password(password: str) -> str:
    # Truncate password to 72 bytes for bcrypt compatibility
    password = password[:72]
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    # Truncate password to 72 bytes for bcrypt compatibility
    plain = plain[:72]
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return False


def create_access_token(subject: str, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])


async def get_current_user(authorization: str = Header(None)):
    """Dependency that reads the Authorization header, decodes JWT, and returns the user document."""
    from ..db import get_db
    from bson.objectid import ObjectId
    from fastapi import HTTPException, status
    if authorization is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization header")
    if authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    else:
        token = authorization
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    db = get_db()
    # try to fetch by ObjectId if possible
    try:
        _id = ObjectId(sub)
        user = await db.users.find_one({"_id": _id})
    except Exception:
        user = await db.users.find_one({"id": sub})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    # normalize id to string
    user["id"] = str(user.get("_id", user.get("id")))
    return user
