import os
from typing import Optional, Any, Dict, List, AsyncIterator

# Attempt to import Motor; if unavailable or incompatible, provide a simple in-memory fallback
try:
    from motor.motor_asyncio import AsyncIOMotorClient  # type: ignore
    _HAS_MOTOR = True
except Exception:
    AsyncIOMotorClient = None  # type: ignore
    _HAS_MOTOR = False

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    MONGO_URI = "mongodb+srv://bhavyan1499a:REPLACE_ME@harmonia.jguhc.mongodb.net/?appName=harmonia"

_client: Optional[Any] = None


class _InMemoryCollection:
    def __init__(self):
        self._items: List[Dict] = []

    async def find_one(self, query: Dict):
        for d in self._items:
            ok = True
            for k, v in query.items():
                if d.get(k) != v:
                    ok = False
                    break
            if ok:
                return d
        return None

    async def insert_one(self, doc: Dict):
        # mimic pymongo InsertOneResult
        import uuid
        _id = str(uuid.uuid4())
        doc_copy = dict(doc)
        doc_copy["_id"] = _id
        self._items.append(doc_copy)
        class R:
            inserted_id = _id
        return R()

    async def update_one(self, query: Dict, update: Dict, upsert: bool = False):
        found = await self.find_one(query)
        if found:
            # apply $set
            if "$set" in update:
                for k, v in update["$set"].items():
                    found[k] = v
            return True
        if upsert:
            doc = dict(query)
            if "$set" in update:
                doc.update(update["$set"])
            await self.insert_one(doc)
            return True
        return False

    def find(self, query: Dict = None):
        async def _aiter():
            for d in list(self._items)[::-1]:
                yield d
        return _aiter()


class _InMemoryDB:
    def __init__(self):
        self.users = _InMemoryCollection()
        self.schedules = _InMemoryCollection()
        self.preferences = _InMemoryCollection()


def get_client() -> Any:
    global _client
    if _client is None:
        if _HAS_MOTOR and AsyncIOMotorClient is not None:
            # Create motor client, then obtain a Database object.
            client = AsyncIOMotorClient(MONGO_URI)
            try:
                # Preferred: use the default database from the URI if provided
                db = client.get_default_database()
            except Exception:
                # If no default DB present in URI, fall back to a named DB
                db = client.get_database("smartcampus")
            _client = db
        else:
            _client = _InMemoryDB()
    return _client


def get_db() -> Any:
    """Get database connection with automatic fallback to in-memory if Motor fails."""
    # get_client now returns either a Motor Database or the in-memory DB
    return get_client()


async def init_db():
    """Initialize database collections and indexes on startup."""
    try:
        db = get_db()
        
        # If Motor is working, create collections and indexes
        if _HAS_MOTOR and hasattr(db, "list_collection_names"):
            try:
                collections = await db.list_collection_names()
                if "users" not in collections:
                    await db.create_collection("users")
                if "schedules" not in collections:
                    await db.create_collection("schedules")
                if "preferences" not in collections:
                    await db.create_collection("preferences")
                
                # Create indexes
                await db.users.create_index("email", unique=True)
                await db.schedules.create_index("user_id")
                await db.preferences.create_index("user_id", unique=True)
            except Exception:
                # Collections may already exist, silently continue
                pass
        # In-memory DB already has collections, no need to create
    except Exception as e:
        print(f"[DB INIT WARNING] {e}")
        # Even if init fails, in-memory DB is available as fallback
