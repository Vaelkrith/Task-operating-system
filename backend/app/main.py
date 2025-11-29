import os
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from .auth import routes as auth_routes
from .auth.utils import get_current_user
from .db import get_db, init_db
from .orchestrator import run_pipeline
from pydantic import BaseModel
from bson.objectid import ObjectId

app = FastAPI(title="Smart Campus Day Optimizer")

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)


@app.on_event("startup")
async def startup():
    """Initialize database on app startup."""
    await init_db()


class OptimizePayload(BaseModel):
    user_id: str
    classes: list
    goals: list
    available_minutes: int
    study_style: str
    wake_time: str


@app.post("/optimize")
async def optimize(payload: OptimizePayload, current_user: dict = Depends(get_current_user)):
    """Run the 4-agent pipeline and save schedule to database."""
    try:
        res = await run_pipeline(payload.dict())
        db = get_db()
        uid = current_user.get("id")
        schedule_doc = {
            "user_id": uid,
            "input_payload": payload.dict(),
            "blocks": res["schedule"].get("blocks", []),
            "agent_logs": res["agent_logs"],
            "created_at": __import__("datetime").datetime.utcnow()
        }
        r = await db.schedules.insert_one(schedule_doc)
        schedule_doc["id"] = str(r.inserted_id)
        # Convert _id to string and remove it from response to avoid ObjectId serialization error
        schedule_doc.pop("_id", None)
        return {"schedule": schedule_doc, "agent_logs": res["agent_logs"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


@app.get("/user/schedules")
async def get_schedules(current_user: dict = Depends(get_current_user)):
    """Retrieve all schedules for the current user."""
    try:
        user_id = current_user.get("id")
        db = get_db()
        cursor = db.schedules.find({"user_id": user_id})
        
        items = []
        # In-memory DB's find() returns an async iterator directly
        # Motor's find() returns a cursor object.
        async for doc in cursor:
            doc["id"] = str(doc.get("_id"))
            doc.pop("_id", None)
            items.append(doc)
        items.sort(key=lambda x: x.get("created_at"), reverse=True)
        return {"schedules": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch schedules: {str(e)}")


@app.post("/user/preferences")
async def set_prefs(payload: dict, current_user: dict = Depends(get_current_user)):
    """Save user preferences."""
    try:
        user_id = current_user.get("id")
        db = get_db()
        await db.preferences.update_one({"user_id": user_id}, {"$set": {"prefs": payload.get("prefs", {})}}, upsert=True)
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save preferences: {str(e)}")
