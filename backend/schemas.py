from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TodoCreate(BaseModel):
    title: str
    priority: Optional[str] = "Medium"
    category: Optional[str] = "Personal"
    due_date: Optional[datetime] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    priority: str
    category: str
    due_date: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}
