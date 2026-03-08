from sqlalchemy import Column, Date, Time, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from core.database import Base

class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    staff_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    appointment_date = Column(Date, nullable=False)
    slot_time = Column(Time, nullable=False)
    is_booked = Column(Boolean, default=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)