from typing import Optional
import uuid
from pydantic import BaseModel, Field, validator
from datetime import datetime


class TaskModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)
    bookmarked: bool = False
    owner: Optional[str]
    status: Optional[str] = 'pending approval'
    created_at: Optional[str] = datetime.now()

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "id": "00010203-0405-0607-0809-0a0b0c0d0e0f",
                "name": "My important task",
                "bookmarked": False,
            }
        }


class UpdateTaskModel(BaseModel):
    name: Optional[str]
    bookmarked: Optional[bool]
    status: Optional[str]

    class Config:
        schema_extra = {
            "example": {
                "name": "My important task",
                "bookmarked": False,
                "status": "approved"
            }
        }
