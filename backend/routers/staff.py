from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.dependencies import get_current_admin_user, get_current_staff_user
from core.security import get_password_hash
from models.user import User
from schemas.user import User as UserSchema, UserCreate, UserUpdate

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
async def get_staff_members(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all staff members (admin only)"""
    staff = db.query(User).filter(User.role == "staff", User.is_active == True).all()
    return staff

@router.get("/{staff_id}", response_model=UserSchema)
async def get_staff_member(
    staff_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_staff_user)
):
    """Get a specific staff member (admin or the staff member themselves)"""
    staff = db.query(User).filter(User.id == staff_id, User.role == "staff").first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    # Allow admin to view any staff, or staff to view themselves
    if current_user.role != "admin" and current_user.id != staff_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this staff member")

    return staff

@router.post("/", response_model=UserSchema)
async def create_staff_member(
    staff: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create a new staff member (admin only)"""
    # Check if email already exists
    db_user = db.query(User).filter(User.email == staff.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Force role to staff
    staff_data = staff.dict()
    staff_data["role"] = "staff"
    staff_data["password_hash"] = get_password_hash(staff.password)

    db_staff = User(**staff_data)
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.put("/{staff_id}", response_model=UserSchema)
async def update_staff_member(
    staff_id: str,
    staff_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_staff_user)
):
    """Update a staff member (admin or the staff member themselves)"""
    staff = db.query(User).filter(User.id == staff_id, User.role == "staff").first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    # Allow admin to update any staff, or staff to update themselves
    if current_user.role != "admin" and current_user.id != staff_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this staff member")

    update_data = staff_update.dict(exclude_unset=True)

    # Only admin can update role and is_active
    if current_user.role != "admin":
        update_data.pop("role", None)
        update_data.pop("is_active", None)

    for field, value in update_data.items():
        setattr(staff, field, value)

    db.commit()
    db.refresh(staff)
    return staff

@router.delete("/{staff_id}")
async def delete_staff_member(
    staff_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Deactivate a staff member (admin only)"""
    staff = db.query(User).filter(User.id == staff_id, User.role == "staff").first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    staff.is_active = False
    db.commit()
    return {"message": "Staff member deactivated successfully"}