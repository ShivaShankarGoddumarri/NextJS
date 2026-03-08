# Claude AI Prompt — Luxe & Trim Salon Application
# Copy everything below this line and paste into Claude

---

## MASTER PROMPT — PASTE THIS INTO CLAUDE CLI OR CLAUDE.AI

---

You are an expert full-stack developer. I want you to build a complete, production-ready, 
fully functional Salon Management Application called "Luxe & Trim" — a premium Men and 
Women salon platform.

---

## TECH STACK

Frontend:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Axios (for API calls to FastAPI)

Backend:
- FastAPI (Python)
- SQLAlchemy (ORM)
- Alembic (database migrations)
- Pydantic (data validation)
- JWT Authentication (python-jose)

Database:
- Supabase (PostgreSQL)
- Prisma (for Next.js side)

Deployment (later):
- Vercel (frontend)
- Render.com (backend)

---

## DESIGN THEME

Name: Luxe & Trim
Theme: Luxury Salon — Men and Women
Primary Color: Gold (#C9A84C)
Secondary Color: Black (#0D0D0D)
Background: Off-white (#FAF9F6)
Accent: White (#FFFFFF)
Font: Inter (headings bold, body regular)

The UI must feel premium, modern, and elegant. Think high-end salon website.
Use shadcn/ui components throughout. Every page must be fully responsive 
(mobile, tablet, desktop).

---

## USER ROLES

The application has 3 user roles:

1. CUSTOMER
   - Register and login
   - Browse services
   - Book appointments
   - View booking history
   - Write reviews and ratings
   - View gallery
   - Manage their profile

2. STAFF / STYLIST
   - Login to staff portal
   - View their appointment schedule
   - Update appointment status (confirmed, in-progress, completed, cancelled)
   - View their own reviews and ratings
   - View their assigned services

3. ADMIN
   - Full dashboard with analytics
   - Manage all appointments
   - Manage services and pricing
   - Manage staff profiles
   - Manage customers
   - View all reviews (approve or delete)
   - Manage gallery (upload, delete photos)
   - View reports (daily, weekly, monthly bookings)

---

## COMPLETE FEATURES LIST

### 1. AUTHENTICATION
- Customer: Register with name, email, phone, password
- Customer: Login with email and password
- Staff & Admin: Login only (no self registration — admin creates staff accounts)
- JWT token based authentication
- Protected routes for each role
- Logout functionality
- Forgot password (send reset link via email)

### 2. HOMEPAGE (Customer facing)
- Hero section with salon name "Luxe & Trim", tagline, and Book Now CTA button
- Featured services section (show top 6 services with price and duration)
- Why choose us section (3-4 USP cards)
- Meet our stylists section (staff cards with photo, name, specialization)
- Customer reviews section (show latest 5-star reviews)
- Gallery section (show latest 8 photos in grid)
- Footer with address, phone, email, social links, working hours

### 3. SERVICES PAGE
- Display all services in a grid
- Filter by category: Hair, Skin, Nails, Beard, Makeup, Spa
- Filter by gender: Men, Women, Unisex
- Each service card shows:
  - Service name
  - Category badge
  - Duration (e.g. 45 mins)
  - Price in INR (e.g. ₹500)
  - Book Now button

### 4. BOOKING SYSTEM
Step 1: Select Service (from services list)
Step 2: Select Staff/Stylist (show available stylists for that service)
Step 3: Select Date (calendar picker — disable past dates and Sundays)
Step 4: Select Time Slot (show available slots 9AM to 7PM in 30-min intervals — grey out booked slots)
Step 5: Confirm Booking (show summary — service, stylist, date, time, price)
Step 6: Booking Confirmed (show booking ID, summary, and option to view bookings)

Booking rules:
- Customer can cancel booking up to 2 hours before appointment
- Customer can rebook a cancelled appointment
- One customer cannot book same time slot twice

### 5. CUSTOMER DASHBOARD
- My Profile (edit name, phone, profile photo)
- My Appointments (tabs: Upcoming, Completed, Cancelled)
  - Each card shows: service, stylist, date, time, status badge, cancel button
- My Reviews (reviews they have written)
- Loyalty Points (show points earned per visit — 10 points per ₹100 spent)

### 6. STAFF PORTAL
- Today's Schedule (timeline view of appointments for today)
- Full Schedule (calendar view of all appointments)
- Each appointment card shows: customer name, service, time, status
- Update status buttons: Confirm, Start, Complete, Cancel
- My Profile (edit bio, specialization, profile photo)
- My Reviews (read-only, show customer reviews for them)

### 7. ADMIN DASHBOARD
Overview cards (top of page):
- Total bookings today
- Total revenue this month (in INR)
- Total active customers
- Total staff members

Charts section:
- Bookings per day (last 7 days) — line chart
- Revenue per week (last 4 weeks) — bar chart
- Bookings by service category — pie chart

### 8. ADMIN — SERVICES MANAGEMENT
- List all services in a table
- Add new service (name, category, gender, duration, price, description, image)
- Edit existing service
- Delete service
- Toggle service active/inactive

### 9. ADMIN — STAFF MANAGEMENT
- List all staff in a card grid
- Add new staff (name, email, phone, password, specialization, services they handle, bio, photo)
- Edit staff details
- Deactivate/activate staff account
- View staff schedule

### 10. ADMIN — APPOINTMENTS MANAGEMENT
- List all appointments with filters (date, status, staff, service)
- View appointment details
- Update appointment status
- Cancel appointment with reason
- Export appointments to CSV

### 11. REVIEWS AND RATINGS
- Customer can only review a service after it is marked completed
- Star rating (1-5) + written review
- Reviews shown on homepage, services page, and stylist profile
- Admin can approve or delete reviews
- Average rating shown on each service and stylist

### 12. GALLERY
- Public gallery page showing salon photos in masonry grid
- Photos organized by category: Haircuts, Color, Beard, Bridal, Spa
- Admin can upload photos with title and category
- Admin can delete photos
- Lightbox viewer when clicking a photo

### 13. STAFF PROFILE PAGE (Public)
- Each stylist has a public profile page
- Shows: photo, name, specialization, bio, services they handle
- Shows their average rating and recent reviews
- Book with this stylist button

---

## DATABASE SCHEMA

Create these tables in Supabase PostgreSQL:

### users
- id (uuid, primary key)
- name (varchar)
- email (varchar, unique)
- phone (varchar)
- password_hash (varchar)
- role (enum: customer, staff, admin)
- profile_photo (varchar, url)
- loyalty_points (integer, default 0)
- is_active (boolean, default true)
- created_at (timestamp)

### services
- id (uuid, primary key)
- name (varchar)
- description (text)
- category (enum: hair, skin, nails, beard, makeup, spa)
- gender (enum: men, women, unisex)
- duration_minutes (integer)
- price (decimal, INR)
- image_url (varchar)
- is_active (boolean, default true)
- created_at (timestamp)

### staff_services (many to many)
- id (uuid)
- staff_id (uuid, foreign key users)
- service_id (uuid, foreign key services)

### appointments
- id (uuid, primary key)
- booking_id (varchar, unique, auto-generated e.g. LT-2024-0001)
- customer_id (uuid, foreign key users)
- staff_id (uuid, foreign key users)
- service_id (uuid, foreign key services)
- appointment_date (date)
- appointment_time (time)
- status (enum: pending, confirmed, in_progress, completed, cancelled)
- cancellation_reason (text, nullable)
- total_price (decimal)
- created_at (timestamp)

### reviews
- id (uuid, primary key)
- customer_id (uuid, foreign key users)
- staff_id (uuid, foreign key users)
- service_id (uuid, foreign key services)
- appointment_id (uuid, foreign key appointments)
- rating (integer, 1-5)
- review_text (text)
- is_approved (boolean, default false)
- created_at (timestamp)

### gallery
- id (uuid, primary key)
- title (varchar)
- image_url (varchar)
- category (varchar)
- uploaded_by (uuid, foreign key users)
- created_at (timestamp)

### time_slots
- id (uuid, primary key)
- staff_id (uuid, foreign key users)
- appointment_date (date)
- slot_time (time)
- is_booked (boolean, default false)
- appointment_id (uuid, nullable, foreign key appointments)

---

## FOLDER STRUCTURE TO CREATE

frontend/
  src/
    app/
      (auth)/
        login/page.tsx
        register/page.tsx
        forgot-password/page.tsx
      (customer)/
        dashboard/page.tsx
        appointments/page.tsx
        profile/page.tsx
        reviews/page.tsx
      (staff)/
        staff/dashboard/page.tsx
        staff/schedule/page.tsx
        staff/profile/page.tsx
      (admin)/
        admin/dashboard/page.tsx
        admin/services/page.tsx
        admin/staff/page.tsx
        admin/appointments/page.tsx
        admin/gallery/page.tsx
        admin/reviews/page.tsx
      book/page.tsx
      services/page.tsx
      gallery/page.tsx
      stylists/page.tsx
      stylists/[id]/page.tsx
      page.tsx (homepage)
      layout.tsx
    components/
      ui/               (shadcn/ui auto-generated)
      shared/
        Navbar.tsx
        Footer.tsx
        ServiceCard.tsx
        StaffCard.tsx
        ReviewCard.tsx
        BookingSteps.tsx
        AppointmentCard.tsx
        StarRating.tsx
        LoadingSpinner.tsx
        ProtectedRoute.tsx
      admin/
        AdminSidebar.tsx
        StatsCard.tsx
        BookingChart.tsx
        RevenueChart.tsx
      staff/
        StaffSidebar.tsx
        ScheduleTimeline.tsx
    lib/
      api.ts            (all axios API calls)
      auth.ts           (auth helpers)
      utils.ts          (utility functions)
      constants.ts      (app constants)
    types/
      index.ts          (all TypeScript interfaces)
    hooks/
      useAuth.ts
      useBooking.ts
      useAppointments.ts
    context/
      AuthContext.tsx
    prisma/
      schema.prisma

backend/
  routers/
    auth.py
    users.py
    services.py
    appointments.py
    staff.py
    reviews.py
    gallery.py
    admin.py
    slots.py
  models/
    user.py
    service.py
    appointment.py
    review.py
    gallery.py
    slot.py
  schemas/
    user.py
    service.py
    appointment.py
    review.py
    gallery.py
  core/
    config.py
    security.py
    database.py
    dependencies.py
  main.py
  requirements.txt
  .env

---

## API ENDPOINTS TO BUILD

### AUTH
POST   /auth/register          - Customer registration
POST   /auth/login             - Login (all roles)
POST   /auth/forgot-password   - Send reset email
POST   /auth/reset-password    - Reset password with token
GET    /auth/me                - Get current user

### SERVICES
GET    /services               - List all active services (with filters)
GET    /services/{id}          - Get service details
POST   /services               - Create service (admin only)
PUT    /services/{id}          - Update service (admin only)
DELETE /services/{id}          - Delete service (admin only)

### STAFF
GET    /staff                  - List all active staff
GET    /staff/{id}             - Get staff profile (public)
GET    /staff/{id}/reviews     - Get staff reviews
GET    /staff/{id}/schedule    - Get staff schedule (staff/admin)
POST   /staff                  - Create staff account (admin only)
PUT    /staff/{id}             - Update staff (admin/staff)

### APPOINTMENTS
GET    /appointments           - List appointments (filtered by role)
GET    /appointments/{id}      - Get appointment details
POST   /appointments           - Create new booking (customer)
PUT    /appointments/{id}      - Update appointment
PATCH  /appointments/{id}/status - Update status (staff/admin)
DELETE /appointments/{id}      - Cancel appointment

### SLOTS
GET    /slots/available        - Get available slots for staff+date
POST   /slots/generate         - Generate slots for a date (admin)

### REVIEWS
GET    /reviews                - List approved reviews
POST   /reviews                - Submit review (customer)
PUT    /reviews/{id}/approve   - Approve review (admin)
DELETE /reviews/{id}           - Delete review (admin)

### GALLERY
GET    /gallery                - List all gallery photos
POST   /gallery                - Upload photo (admin)
DELETE /gallery/{id}           - Delete photo (admin)

### ADMIN
GET    /admin/stats            - Dashboard overview stats
GET    /admin/revenue          - Revenue reports
GET    /admin/bookings-chart   - Bookings chart data

---

## BUILD ORDER — FOLLOW THIS EXACTLY

Build in this exact order so nothing breaks:

### PHASE 1 — Backend Foundation
1. Setup FastAPI project structure
2. Create database.py (Supabase connection)
3. Create all SQLAlchemy models
4. Create all Pydantic schemas
5. Setup JWT authentication in core/security.py
6. Build auth router (register, login, me)
7. Test with Swagger UI at localhost:8000/docs

### PHASE 2 — Backend APIs
8. Build services router (CRUD)
9. Build staff router (CRUD + schedule)
10. Build slots router (generate + availability)
11. Build appointments router (booking + status updates)
12. Build reviews router
13. Build gallery router
14. Build admin router (stats, charts)
15. Test all endpoints with Swagger UI

### PHASE 3 — Frontend Foundation
16. Setup Next.js project with Tailwind and shadcn/ui
17. Create TypeScript interfaces in types/index.ts
18. Create API service layer in lib/api.ts
19. Create AuthContext and useAuth hook
20. Build Navbar and Footer components
21. Setup protected routes

### PHASE 4 — Frontend Pages
22. Build Login and Register pages
23. Build Homepage with all sections
24. Build Services page with filters
25. Build Booking flow (5 steps)
26. Build Customer Dashboard
27. Build Staff Portal (dashboard + schedule)
28. Build Admin Dashboard with charts
29. Build Admin pages (services, staff, appointments, gallery, reviews)
30. Build Gallery page with lightbox
31. Build Stylist profile pages

### PHASE 5 — Polish
32. Add loading states to all pages
33. Add error handling and toast notifications
34. Make all pages fully responsive
35. Add empty states for lists
36. Final UI polish pass

---

## IMPORTANT INSTRUCTIONS FOR CLAUDE

1. Build ONE phase at a time. Do not skip ahead.
2. Write COMPLETE code for every file — no placeholders, no TODOs.
3. Every component must use shadcn/ui where possible.
4. Use the Gold (#C9A84C) and Black (#0D0D0D) theme consistently.
5. All prices must show Indian Rupee symbol ₹.
6. All API calls must use Axios from lib/api.ts — never fetch directly in components.
7. TypeScript types must be used everywhere — no 'any' types.
8. Every form must have proper validation.
9. Every page must have proper loading and error states.
10. Mobile-first responsive design throughout.
11. Use React Context for auth state management.
12. JWT token must be stored in httpOnly cookies — not localStorage.
13. All database queries must use SQLAlchemy ORM — no raw SQL.
14. FastAPI endpoints must have proper error handling with HTTPException.
15. After each phase, tell me what was built and what to test before moving on.

---

## HOW TO START

Say exactly this to Claude to begin:

"Start with PHASE 1 — Backend Foundation. 
Build the complete FastAPI project structure for Luxe & Trim salon app.
Create all files in the build order listed. 
After each file, explain what it does in simple terms.
My Supabase DATABASE_URL is: [paste your supabase connection string here]"

Then after Phase 1 is done, say:
"Phase 1 is working. Now start PHASE 2 — Backend APIs."

Continue phase by phase until the app is complete.

---

## TIPS FOR BEST RESULTS

- If Claude stops mid-way, say: "Continue from where you stopped"
- If a file has an error, paste the error and say: "Fix this error"
- If you want to change something, say: "In [filename], change [X] to [Y]"
- After each phase, test in browser before moving to next phase
- Save all files to your project folder as Claude generates them
- Use Windsurf or VS Code to paste and run the code

---

*Prompt prepared for: Shiva Shankar Goddumarri*
*App: Luxe & Trim — Premium Salon Management System*
*Stack: Next.js + TypeScript + Tailwind + shadcn/ui + FastAPI + Supabase*
*Theme: Black + Gold + White (Luxury)*
