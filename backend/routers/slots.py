from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, time, datetime, timedelta
from typing import List
from core.database import get_db
from core.dependencies import get_current_admin_user
from models.slot import TimeSlot
from models.appointment import Appointment
from schemas.appointment import AppointmentCreate

router = APIRouter()

@router.get("/available")
async def get_available_slots(
    staff_id: str,
    appointment_date: date,
    db: Session = Depends(get_db)
):
    """Get available time slots for a staff member on a specific date"""
    # Check if date is not in the past and not Sunday
    today = date.today()
    if appointment_date < today:
        raise HTTPException(status_code=400, detail="Cannot book appointments in the past")
    if appointment_date.weekday() == 6:  # Sunday
        raise HTTPException(status_code=400, detail="Salon is closed on Sundays")

    # Generate all possible slots (9 AM to 7 PM, 30-min intervals)
    slots = []
    current_time = time(9, 0)  # 9:00 AM
    end_time = time(19, 0)     # 7:00 PM

    while current_time < end_time:
        # Check if slot is already booked
        booked = db.query(TimeSlot).filter(
            TimeSlot.staff_id == staff_id,
            TimeSlot.appointment_date == appointment_date,
            TimeSlot.slot_time == current_time,
            TimeSlot.is_booked == True
        ).first() is not None

        slots.append({
            "time": current_time.strftime("%H:%M"),
            "available": not booked
        })

        # Add 30 minutes
        dt = datetime.combine(appointment_date, current_time) + timedelta(minutes=30)
        current_time = dt.time()

    return {"date": appointment_date, "staff_id": staff_id, "slots": slots}

@router.post("/generate")
async def generate_slots_for_date(
    staff_id: str,
    appointment_date: date,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Generate time slots for a staff member on a specific date (admin only)"""
    # Check if slots already exist for this date and staff
    existing_slots = db.query(TimeSlot).filter(
        TimeSlot.staff_id == staff_id,
        TimeSlot.appointment_date == appointment_date
    ).count()

    if existing_slots > 0:
        raise HTTPException(status_code=400, detail="Slots already generated for this date")

    # Generate slots from 9 AM to 7 PM, 30-min intervals
    slots_to_create = []
    current_time = time(9, 0)
    end_time = time(19, 0)

    while current_time < end_time:
        slot = TimeSlot(
            staff_id=staff_id,
            appointment_date=appointment_date,
            slot_time=current_time,
            is_booked=False
        )
        slots_to_create.append(slot)

        # Add 30 minutes
        dt = datetime.combine(appointment_date, current_time) + timedelta(minutes=30)
        current_time = dt.time()

    db.add_all(slots_to_create)
    db.commit()

    return {"message": f"Generated {len(slots_to_create)} slots for {appointment_date}"}