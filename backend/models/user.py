from sqlalchemy import Column, String, Boolean, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    # password_hash may be null for users created via Supabase auth directly.
    # we still generate a hash on the frontend so new signups will have it, but
    # allowing nullable prevents errors on existing rows and keeps the schema
    # compatible across both auth flows.
    password_hash = Column(String, nullable=True)
    role = Column(String, nullable=False)  # customer, staff, admin
    profile_photo = Column(String, nullable=True)
    loyalty_points = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())