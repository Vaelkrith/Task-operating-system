from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class ScheduleBlock(BaseModel):
    id: Optional[str]
    type: str  # task, break, class
    title: str
    start: str
    end: str
    color: Optional[str]
    meta: Optional[Dict[str, Any]]


class AgentLog(BaseModel):
    agent: str
    message: str
    detail: Optional[Dict[str, Any]]


class ScheduleCreate(BaseModel):
    user_id: str
    input_payload: Dict[str, Any]
    blocks: List[ScheduleBlock]
    agent_logs: List[AgentLog]
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ScheduleInDB(ScheduleCreate):
    id: Optional[str]
