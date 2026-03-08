from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    gender: str
    duration_minutes: int
    price: Decimal
    image_url: Optional[str] = None
    is_active: bool = True

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    gender: Optional[str] = None
    duration_minutes: Optional[int] = None
    price: Optional[Decimal] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class Service(ServiceBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True