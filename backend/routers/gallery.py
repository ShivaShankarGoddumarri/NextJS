from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.dependencies import get_current_admin_user
from models.gallery import Gallery
from schemas.gallery import Gallery as GallerySchema, GalleryCreate, GalleryUpdate

router = APIRouter()

@router.get("/", response_model=List[GallerySchema])
async def get_gallery_photos(
    category: str = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get gallery photos (public)"""
    query = db.query(Gallery)
    if category:
        query = query.filter(Gallery.category == category)

    photos = query.offset(skip).limit(limit).all()
    return photos

@router.post("/", response_model=GallerySchema)
async def upload_photo(
    photo: GalleryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Upload a new photo (admin only)"""
    db_photo = Gallery(
        title=photo.title,
        image_url=photo.image_url,
        category=photo.category,
        uploaded_by=current_user.id
    )

    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo

@router.put("/{photo_id}", response_model=GallerySchema)
async def update_photo(
    photo_id: str,
    photo_update: GalleryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update a photo (admin only)"""
    photo = db.query(Gallery).filter(Gallery.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    update_data = photo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(photo, field, value)

    db.commit()
    db.refresh(photo)
    return photo

@router.delete("/{photo_id}")
async def delete_photo(
    photo_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete a photo (admin only)"""
    photo = db.query(Gallery).filter(Gallery.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    db.delete(photo)
    db.commit()
    return {"message": "Photo deleted successfully"}