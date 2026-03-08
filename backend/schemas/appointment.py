from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date, time
from decimal import Decimal

class AppointmentBase(BaseModel):
    booking_id: str
    customer_id: str
    staff_id: str
    service_id: str
    appointment_date: date
    appointment_time: time
    status: str = "pending"
    cancellation_reason: Optional[str] = None
    total_price: Decimal

class AppointmentCreate(BaseModel):
    customer_id: str
    staff_id: str
    service_id: str
    appointment_date: date
    appointment_time: time

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    cancellation_reason: Optional[str] = None

class Appointment(AppointmentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class AppointmentWithDetails(Appointment):
    customer_name: str
    staff_name: str
    service_name: str
    service_category: str