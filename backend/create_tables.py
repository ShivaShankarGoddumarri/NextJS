#!/usr/bin/env python3

from core.database import engine, Base
from models import User, Service, Appointment, Review, Gallery, TimeSlot

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()