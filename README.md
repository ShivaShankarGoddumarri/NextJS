This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Luxe & Trim Salon App

This repository powers a full-stack salon booking platform with:

- **Supabase** for authentication and PostgreSQL database
- **FastAPI** backend providing additional REST endpoints
- **Next.js (app router)** frontend with Tailwind CSS and TypeScript
- Role-based access (customer, staff, admin)

## Setup Instructions

1. Clone and install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with your Supabase keys and database URL:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
   ```
3. Initialize your database tables (see `backend/create_tables.py` or use Supabase SQL).
4. Run development server:
   ```bash
   npm run dev
   ```
5. Visit [http://localhost:3000](http://localhost:3000) to access the site.

## Features Implemented

- Authentication pages (login/register)
- Service browsing & details
- Appointment booking with time slot selection
- Customer dashboard & profile management
- Gallery and reviews pages
- Protected routes for all user roles

## Next Steps

- Add payment integration
- Build out staff/admin dashboards
- Enhance styling and add mobile features

Enjoy building and customizing your salon platform!
"# NextJS"
"# NextJS"
"# NextJS"
