from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GalleryBase(BaseModel):
    title: str
    image_url: str
    category: str
    uploaded_by: str

class GalleryCreate(BaseModel):
    title: str
    image_url: str
    category: str

class GalleryUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class Gallery(GalleryBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True