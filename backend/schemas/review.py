from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    customer_id: str
    staff_id: str
    service_id: str
    appointment_id: str
    rating: int
    review_text: Optional[str] = None
    is_approved: bool = False

class ReviewCreate(BaseModel):
    staff_id: str
    service_id: str
    appointment_id: str
    rating: int
    review_text: Optional[str] = None

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    review_text: Optional[str] = None
    is_approved: Optional[bool] = None

class Review(ReviewBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewWithNames(Review):
    customer_name: str
    staff_name: str
    service_name: str