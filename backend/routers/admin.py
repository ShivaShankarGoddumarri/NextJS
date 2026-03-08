from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import List, Dict, Any
from core.database import get_db
from core.dependencies import get_current_admin_user
from models.appointment import Appointment
from models.user import User
from models.service import Service
from models.review import Review

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get dashboard overview statistics"""
    today = datetime.now().date()

    # Today's appointments
    today_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.appointment_date == today
    ).scalar()

    # This month's revenue
    start_of_month = today.replace(day=1)
    monthly_revenue = db.query(func.sum(Appointment.total_price)).filter(
        Appointment.appointment_date >= start_of_month,
        Appointment.status == "completed"
    ).scalar() or 0

    # Active customers
    active_customers = db.query(func.count(User.id)).filter(
        User.role == "customer",
        User.is_active == True
    ).scalar()

    # Total staff
    total_staff = db.query(func.count(User.id)).filter(
        User.role == "staff",
        User.is_active == True
    ).scalar()

    return {
        "today_appointments": today_appointments,
        "monthly_revenue": float(monthly_revenue),
        "active_customers": active_customers,
        "total_staff": total_staff
    }

@router.get("/revenue")
async def get_revenue_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get revenue statistics for charts"""
    # Last 4 weeks revenue
    revenue_data = []
    for i in range(4):
        week_start = datetime.now() - timedelta(weeks=i)
        week_end = week_start + timedelta(days=6)

        revenue = db.query(func.sum(Appointment.total_price)).filter(
            Appointment.appointment_date >= week_start.date(),
            Appointment.appointment_date <= week_end.date(),
            Appointment.status == "completed"
        ).scalar() or 0

        revenue_data.append({
            "week": f"Week {4-i}",
            "revenue": float(revenue)
        })

    return {"revenue": list(reversed(revenue_data))}

@router.get("/bookings-chart")
async def get_bookings_chart(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get bookings data for charts"""
    # Last 7 days bookings
    bookings_data = []
    for i in range(7):
        date = datetime.now().date() - timedelta(days=i)

        count = db.query(func.count(Appointment.id)).filter(
            Appointment.appointment_date == date
        ).scalar()

        bookings_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "bookings": count
        })

    return {"bookings": list(reversed(bookings_data))}

@router.get("/services-chart")
async def get_services_chart(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get service category distribution"""
    from sqlalchemy import text

    # Get service categories and their booking counts
    result = db.execute(text("""
        SELECT s.category, COUNT(a.id) as booking_count
        FROM services s
        LEFT JOIN appointments a ON s.id = a.service_id
        WHERE s.is_active = true
        GROUP BY s.category
        ORDER BY booking_count DESC
    """)).fetchall()

    services_data = [
        {"category": row[0], "bookings": row[1]} for row in result
    ]

    return {"services": services_data}