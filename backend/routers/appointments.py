from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from core.database import get_db
from core.dependencies import get_current_user, get_current_admin_user, get_current_staff_user
from models.appointment import Appointment
from models.service import Service
from models.user import User
from models.slot import TimeSlot
from schemas.appointment import (
    Appointment as AppointmentSchema,
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentWithDetails
)
import uuid

router = APIRouter()

def generate_booking_id():
    """Generate a unique booking ID like LT-2024-0001"""
    year = datetime.now().year
    # In a real app, you'd track the last booking number
    # For now, we'll use a simple counter
    return f"LT-{year}-{uuid.uuid4().hex[:4].upper()}"

@router.get("/", response_model=List[AppointmentWithDetails])
async def get_appointments(
    status_filter: Optional[str] = None,
    staff_id: Optional[str] = None,
    date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get appointments based on user role"""
    query = db.query(
        Appointment,
        User.name.label("customer_name"),
        User.email.label("customer_email"),
        Service.name.label("service_name"),
        Service.category.label("service_category")
    ).join(User, Appointment.customer_id == User.id)\
     .join(Service, Appointment.service_id == Service.id)

    # Filter based on user role
    if current_user.role == "customer":
        query = query.filter(Appointment.customer_id == current_user.id)
    elif current_user.role == "staff":
        query = query.filter(Appointment.staff_id == current_user.id)
    # Admin can see all

    if status_filter:
        query = query.filter(Appointment.status == status_filter)
    if staff_id:
        query = query.filter(Appointment.staff_id == staff_id)
    if date:
        query = query.filter(Appointment.appointment_date == date)

    results = query.all()

    appointments = []
    for appointment, customer_name, customer_email, service_name, service_category in results:
        appointment_dict = {
            **appointment.__dict__,
            "customer_name": customer_name,
            "staff_name": "",  # We'll get this separately
            "service_name": service_name,
            "service_category": service_category
        }
        appointments.append(appointment_dict)

    return appointments

@router.get("/{appointment_id}", response_model=AppointmentWithDetails)
async def get_appointment(
    appointment_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific appointment"""
    query = db.query(
        Appointment,
        User.name.label("customer_name"),
        User.name.label("staff_name"),
        Service.name.label("service_name"),
        Service.category.label("service_category")
    ).join(User, Appointment.customer_id == User.id)\
     .join(Service, Appointment.service_id == Service.id)\
     .filter(Appointment.id == appointment_id)

    result = query.first()
    if not result:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment, customer_name, staff_name, service_name, service_category = result

    # Check permissions
    if (current_user.role == "customer" and appointment.customer_id != current_user.id) or \
       (current_user.role == "staff" and appointment.staff_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this appointment")

    return {
        **appointment.__dict__,
        "customer_name": customer_name,
        "staff_name": staff_name,
        "service_name": service_name,
        "service_category": service_category
    }

@router.post("/", response_model=AppointmentSchema)
async def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new appointment (customers only)"""
    if current_user.role != "customer":
        raise HTTPException(status_code=403, detail="Only customers can book appointments")

    # Validate service exists and is active
    service = db.query(Service).filter(
        Service.id == appointment.service_id,
        Service.is_active == True
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found or inactive")

    # Validate staff exists and is active
    staff = db.query(User).filter(
        User.id == appointment.staff_id,
        User.role == "staff",
        User.is_active == True
    ).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found or inactive")

    # Check if slot is available
    slot = db.query(TimeSlot).filter(
        TimeSlot.staff_id == appointment.staff_id,
        TimeSlot.appointment_date == appointment.appointment_date,
        TimeSlot.slot_time == appointment.appointment_time,
        TimeSlot.is_booked == False
    ).first()
    if not slot:
        raise HTTPException(status_code=400, detail="Time slot not available")

    # Create appointment
    db_appointment = Appointment(
        booking_id=generate_booking_id(),
        customer_id=current_user.id,
        staff_id=appointment.staff_id,
        service_id=appointment.service_id,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time,
        total_price=service.price,
        status="pending"
    )

    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)

    # Mark slot as booked
    slot.is_booked = True
    slot.appointment_id = db_appointment.id
    db.commit()

    return db_appointment

@router.patch("/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: str,
    status_update: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_staff_user)
):
    """Update appointment status (staff/admin only)"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Check permissions
    if current_user.role != "admin" and appointment.staff_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this appointment")

    if status_update.status:
        appointment.status = status_update.status
    if status_update.cancellation_reason:
        appointment.cancellation_reason = status_update.cancellation_reason

    db.commit()
    db.refresh(appointment)
    return appointment

@router.delete("/{appointment_id}")
async def cancel_appointment(
    appointment_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Cancel an appointment"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Check permissions and timing
    if current_user.role == "customer" and appointment.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this appointment")

    if appointment.status in ["completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Cannot cancel completed or already cancelled appointment")

    # Check cancellation policy (2 hours before)
    from datetime import datetime, timedelta
    appointment_datetime = datetime.combine(appointment.appointment_date, appointment.appointment_time)
    if datetime.now() + timedelta(hours=2) > appointment_datetime:
        raise HTTPException(status_code=400, detail="Cannot cancel appointment less than 2 hours before")

    appointment.status = "cancelled"
    appointment.cancellation_reason = "Cancelled by user"

    # Free up the time slot
    slot = db.query(TimeSlot).filter(TimeSlot.appointment_id == appointment_id).first()
    if slot:
        slot.is_booked = False
        slot.appointment_id = None

    db.commit()
    return {"message": "Appointment cancelled successfully"}