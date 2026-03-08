from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from core.database import get_db
from core.dependencies import get_current_admin_user
from models.service import Service
from schemas.service import Service as ServiceSchema, ServiceCreate, ServiceUpdate

router = APIRouter()

@router.get("/", response_model=List[ServiceSchema])
async def get_services(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = None,
    gender: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all active services with optional filtering"""
    query = db.query(Service).filter(Service.is_active == True)

    if category:
        query = query.filter(Service.category == category)
    if gender:
        query = query.filter(Service.gender == gender)

    services = query.offset(skip).limit(limit).all()
    return services

@router.get("/{service_id}", response_model=ServiceSchema)
async def get_service(service_id: str, db: Session = Depends(get_db)):
    """Get a specific service by ID"""
    service = db.query(Service).filter(Service.id == service_id, Service.is_active == True).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/", response_model=ServiceSchema)
async def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create a new service (admin only)"""
    db_service = Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.put("/{service_id}", response_model=ServiceSchema)
async def update_service(
    service_id: str,
    service_update: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update a service (admin only)"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = service_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}")
async def delete_service(
    service_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete a service (admin only) - soft delete by setting is_active=False"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    service.is_active = False
    db.commit()
    return {"message": "Service deleted successfully"}