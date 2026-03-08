from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.dependencies import get_current_user, get_current_admin_user
from models.review import Review
from models.appointment import Appointment
from models.user import User
from models.service import Service
from schemas.review import Review as ReviewSchema, ReviewCreate, ReviewUpdate, ReviewWithNames

router = APIRouter()

@router.get("/", response_model=List[ReviewWithNames])
async def get_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    approved_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get reviews (approved only for public, all for admin)"""
    query = db.query(
        Review,
        User.name.label("customer_name"),
        User.name.label("staff_name"),
        Service.name.label("service_name")
    ).join(User, Review.customer_id == User.id)\
     .join(Service, Review.service_id == Service.id)\
     .filter(Review.is_approved == approved_only)

    reviews = query.offset(skip).limit(limit).all()

    result = []
    for review, customer_name, staff_name, service_name in reviews:
        result.append({
            **review.__dict__,
            "customer_name": customer_name,
            "staff_name": staff_name,
            "service_name": service_name
        })

    return result

@router.post("/", response_model=ReviewSchema)
async def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a review (customers only, after appointment completion)"""
    if current_user.role != "customer":
        raise HTTPException(status_code=403, detail="Only customers can write reviews")

    # Check if appointment exists and belongs to user
    appointment = db.query(Appointment).filter(
        Appointment.id == review.appointment_id,
        Appointment.customer_id == current_user.id,
        Appointment.status == "completed"
    ).first()
    if not appointment:
        raise HTTPException(status_code=400, detail="Invalid appointment or appointment not completed")

    # Check if review already exists for this appointment
    existing_review = db.query(Review).filter(Review.appointment_id == review.appointment_id).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="Review already exists for this appointment")

    # Validate rating
    if not (1 <= review.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    db_review = Review(
        customer_id=current_user.id,
        staff_id=review.staff_id,
        service_id=review.service_id,
        appointment_id=review.appointment_id,
        rating=review.rating,
        review_text=review.review_text,
        is_approved=False  # Requires admin approval
    )

    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.put("/{review_id}/approve")
async def approve_review(
    review_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Approve a review (admin only)"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_approved = True
    db.commit()
    return {"message": "Review approved successfully"}

@router.delete("/{review_id}")
async def delete_review(
    review_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete a review (admin only)"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully"}