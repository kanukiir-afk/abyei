# Deployment Guide - Abyei Students in Rwanda

This guide covers deploying both the frontend (Next.js) to Vercel and the backend (Express) to Railway.

## Frontend Deployment to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from Project Root
```bash
cd /home/pc/Desktop/south-project
vercel --prod
```

When prompted:
- **Project name**: `abyei` (or your preferred name)
- **Which scope should contain your project?**: Choose your personal account
- **Link to existing project?**: No (first deployment)
- **Project root directory**: `./apps/frontend`
- **Build command**: `npm run build`
- **Output directory**: `.next`

### Step 4: Configure Environment Variables in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project (`abyei`)
3. Go to **Settings → Environment Variables**
4. Add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://abyei-backend.railway.app` (update after backend deployment)
   - Environments: Production, Preview, Development

### Step 5: Redeploy After Setting Environment Variables
```bash
vercel --prod --force-build
```

## Backend Deployment to Railway

### Step 1: Sign Up for Railway
Visit https://railway.app and sign up using GitHub

### Step 2: Create New Project
1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Choose your GitHub repository (`kanukiir-afk/abyei`)

### Step 3: Configure Build Settings
Railway should auto-detect Node.js. Set:
- **Root Directory**: `apps/backend`

### Step 4: Add PostgreSQL Database
1. Click "Add Service" in Railway dashboard
2. Select "PostgreSQL"
3. Railway will automatically provision a database

### Step 5: Configure Environment Variables in Railway
1. Go to your project in Railway
2. Click on the Node.js service
3. Go to **Variables** tab
4. Add:
   ```
   DATABASE_URL=[Railway will auto-generate this]
   JWT_SECRET=your_very_secure_secret_here_change_this
   NODE_ENV=production
   PORT=4000
   ```

5. For Database Connection:
   - Railway auto-creates `DATABASE_URL`
   - Verify it's formatted as: `postgresql://user:password@host:port/database`

### Step 6: Deploy
- Railway auto-deploys when you push to GitHub
- Check deployment logs in Railway dashboard
- Note the backend URL (e.g., `https://abyei-backend.railway.app`)

### Step 7: Update Frontend Configuration
After backend is deployed and you have the Railway URL:

1. Go back to Vercel dashboard
2. Update the `NEXT_PUBLIC_API_URL` environment variable with your Railway backend URL
3. Redeploy frontend: `vercel --prod --force-build`

## Production Database Setup (Railway)

### Step 1: Connect to Railway PostgreSQL
```bash
# Get connection string from Railway dashboard
# Format: postgresql://user:password@host:port/database

# Connect using psql
psql "postgresql://user:password@host:port/database"
```

### Step 2: Run Prisma Migrations on Production
```bash
cd apps/backend
DATABASE_URL="postgresql://user:password@host:port/database" npx prisma migrate deploy
```

### Step 3: Seed Production Database (Optional)
Create an admin user script if needed

## Verification

### Test Frontend
1. Visit your Vercel URL: `https://abyei.vercel.app`
2. Check that all pages load
3. Verify API calls work

### Test Backend
```bash
# Test health endpoint
curl https://abyei-backend.railway.app/api/health

# Test login endpoint
curl -X POST https://abyei-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Test Database Connection
Visit admin page and try:
- Adding news/events
- Viewing existing data
- User management

## Troubleshooting

### Frontend Build Fails
- Check that `next.config.js` is properly configured
- Verify all imports are correct
- Check `.env.production` for correct API URL

### Backend Fails to Start
- Verify `DATABASE_URL` is correctly set
- Check that all environment variables are present
- View Railway logs for specific errors

### Database Connection Issues
- Verify PostgreSQL is running on Railway
- Check DATABASE_URL format
- Run `npx prisma db push` to verify schema

### CORS Issues
- Backend needs to allow Vercel domain
- Update CORS settings in `src/server.ts`:
```typescript
app.use(cors({
  origin: ['https://abyei.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Post-Deployment

### Set Up Custom Domain (Optional)
1. In Vercel: Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Set Up CI/CD
GitHub Actions workflows can be added to auto-deploy on push

### Monitor Performance
- Vercel Analytics: Dashboard → Analytics
- Railway: View logs and metrics in dashboard

## Rollback
If deployment has issues:

**Vercel**: Click "Deployments" and revert to previous version
**Railway**: Redeploy previous commit from GitHub

