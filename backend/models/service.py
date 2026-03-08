from sqlalchemy import Column, String, Boolean, Integer, Numeric, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from core.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=False)  # hair, skin, nails, beard, makeup, spa
    gender = Column(String, nullable=False)  # men, women, unisex
    duration_minutes = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())