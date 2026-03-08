from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users, services, appointments, staff, reviews, gallery, admin, slots

app = FastAPI(
    title="Luxe & Trim Salon API",
    description="Premium Salon Management System API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(services.router, prefix="/services", tags=["Services"])
app.include_router(appointments.router, prefix="/appointments", tags=["Appointments"])
app.include_router(staff.router, prefix="/staff", tags=["Staff"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
app.include_router(gallery.router, prefix="/gallery", tags=["Gallery"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(slots.router, prefix="/slots", tags=["Time Slots"])

@app.get("/")
async def root():
    return {"message": "Welcome to Luxe & Trim Salon API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)