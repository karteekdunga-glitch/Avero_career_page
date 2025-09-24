# Avero Advisors — Career Portal (Full-Stack)

Production-ready starter for a dynamic Careers Portal built for **Avero Advisors**.

**Stack**
- **Frontend:** React 18 (Vite), React Router, Context API, Tailwind CSS, Axios
- **Backend:** Node.js 20, Express, Multer uploads, JWT auth, Mongoose (optional), HubSpot API client
- **Integrations:** HubSpot Forms/CRM via `@hubspot/api-client`, Nodemailer email notifications
- **Security/Perf:** Helmet, CORS, rate limiting, input validation, XSS sanitization
- **Deployment:** Vercel (frontend) + Render/Heroku/AWS (backend)

> Tailor the branding (colors, logo) to match Avero Advisors. The homepage includes the statement:
> _"We don’t just consult, we advise, we guide, we deliver."_

## Quick Start

### 1) Backend
```bash
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev   # starts on http://localhost:4000
```

### 2) Frontend
```bash
cd client
npm install
npm run dev   # opens on http://localhost:5173
```

### Environment variables
See `server/.env.example` for all values. Minimal to get started:
```
PORT=4000
CORS_ORIGIN=http://localhost:5173

# HubSpot
HUBSPOT_ACCESS_TOKEN=your_hubspot_private_app_token

# Optional MongoDB
MONGO_URI=mongodb://localhost:27017/avero_careers

# File uploads (local by default). If using S3, fill the S3_* vars.
UPLOAD_DIR=./uploads

# Admin seed (dev only)
ADMIN_EMAIL=admin@averoadvisors.com
ADMIN_PASSWORD=ChangeMe123!

# SMTP for notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey_or_user
SMTP_PASS=secret
ADMIN_NOTIFICATIONS=noreply@averoadvisors.com
```

### Seed Jobs
- The backend serves seed jobs from `server/seed/jobs.seed.json` (and/or MongoDB if configured).
- Admin endpoints let you create/update jobs (JWT-protected).

### Scripts
- **server:** `npm run dev` (nodemon), `npm start`
- **client:** `npm run dev`, `npm run build`, `npm run preview`

### Deployment
- **Frontend (Vercel):** set `VITE_API_BASE` to your backend URL (env var on Vercel).
- **Backend (Render/Heroku/AWS):** set the env vars in the dashboard.
- Enforce HTTPS on the platform and set `CORS_ORIGIN` accordingly.

---

## Project Structure

```
avero-careers/
├─ server/               # Express API (jobs, applications, auth, admin)
└─ client/               # React app (Vite, Tailwind, Router)
```
