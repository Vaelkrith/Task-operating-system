from fastapi import APIRouter, HTTPException, Depends, Response
from ..db import get_db
from ..models.user import UserCreate
from ..auth.utils import hash_password, verify_password, create_access_token
from bson.objectid import ObjectId
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginPayload(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(payload: UserCreate):
    """Create a new user account and return JWT."""
    try:
        db = get_db()
        existing = await db.users.find_one({"email": payload.email})
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")
        hashed = hash_password(payload.password)
        user_doc = {"email": payload.email, "hashed_password": hashed, "name": payload.name}
        res = await db.users.insert_one(user_doc)
        user_id = str(res.inserted_id)
        token = create_access_token(user_id)
        return {"access_token": token, "token_type": "bearer", "user": {"id": user_id, "email": payload.email, "name": payload.name}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")


@router.post("/login")
async def login(payload: LoginPayload, response: Response):
    """Authenticate user and return JWT."""
    try:
        db = get_db()
        user = await db.users.find_one({"email": payload.email})
        if not user:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        if not verify_password(payload.password, user["hashed_password"]):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        user_id = str(user.get("_id", user.get("id")))
        token = create_access_token(user_id)
        # Return token and set as cookie for convenience
        response.set_cookie(key="access_token", value=token, httponly=True, max_age=7*24*60*60)
        return {"access_token": token, "token_type": "bearer", "user": {"id": user_id, "email": user.get("email"), "name": user.get("name")}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
