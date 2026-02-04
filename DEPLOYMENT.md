# Deployment

## Overview
- Frontend: Vercel (Next.js App)
- Backend: Railway (Node.js/Express)
- Database: Railway PostgreSQL

## Environment
Create `.env` entries on Railway and Vercel as needed. Use `.env.example` as a reference.

### Backend required env vars (Railway)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — strong secret for signing tokens
- `NODE_ENV=production`

### Frontend required env vars (Vercel)
- `NEXT_PUBLIC_API_URL` — URL of deployed backend (https://your-backend.up.railway.app)
- `NEXT_PUBLIC_SITE_NAME` — site display name

## Backend (Railway)
1. Push the backend folder to a Git repo connected to Railway.
2. On Railway, create a new project and connect the repository and set `DATABASE_URL`.
3. Set `JWT_SECRET` in project environment variables.
4. Run Prisma migrations from Railway CLI or via a deploy script:

```bash
# locally or in Railway shell
npx prisma generate
npx prisma migrate deploy
```

5. Start the service (Railway handles this via the repo).

## Frontend (Vercel)
1. Push the frontend to a Git repo and connect it to Vercel.
2. Set `NEXT_PUBLIC_API_URL` in Vercel environment variables.
3. Use Vercel defaults for building Next.js apps (no special build step required beyond `next build`).

## Notes
- Ensure CORS on backend allows the Vercel origin or use a proxy.
- For production, consider storing media in an object storage (S3-compatible) and reference URLs in `Media`.
- Email confirmations require an SMTP provider; configure sending in the backend and add credentials to Railway env.
