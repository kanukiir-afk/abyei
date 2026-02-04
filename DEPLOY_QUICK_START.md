# Quick Start: Deploy to Vercel & Railway

## 🚀 What's Configured

Your project is ready for deployment with the following setup:

- **Frontend**: Next.js on Vercel
- **Backend**: Express + Node.js on Railway  
- **Database**: PostgreSQL on Railway
- **Repository**: GitHub (kanukiir-afk/abyei)

---

## ⚡ QUICK DEPLOY (3 Steps)

### Step 1: Deploy to Vercel (Frontend)

```bash
vercel --prod
```

**When prompted:**
- Project name: `abyei`
- Output directory: `.next`
- Build command: `npm run build`

**Result**: You'll get a URL like `https://abyei.vercel.app`

---

### Step 2: Set Up Railway (Backend)

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"Create New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose `kanukiir-afk/abyei` repository
6. Set Root Directory to: `apps/backend`
7. Click **Deploy**

**During deployment, Railway will:**
- Auto-detect Node.js
- Create PostgreSQL database
- Set up environment variables

---

### Step 3: Configure Environment Variables

#### In Railway Dashboard:

1. Go to your project
2. Click on the **Node.js** service
3. Click **"Variables"** tab
4. Railway auto-creates `DATABASE_URL`
5. Add these:
   ```
   JWT_SECRET=abyei_secret_key_change_this_in_production
   NODE_ENV=production
   PORT=4000
   ```

#### In Vercel Dashboard:

1. Go to your project
2. Settings → **Environment Variables**
3. Add:
   ```
   NEXT_PUBLIC_API_URL=https://[YOUR-RAILWAY-URL].railway.app
   ```
   (Railway will give you the exact URL)
4. Click **Save**
5. **Redeploy**: `vercel --prod --force-build`

---

## 📋 Complete Deployment Checklist

- [ ] Vercel CLI installed: `vercel --version`
- [ ] GitHub repository connected
- [ ] Deployed frontend to Vercel
- [ ] Deployed backend to Railway
- [ ] PostgreSQL auto-provisioned on Railway
- [ ] Environment variables set in both platforms
- [ ] Backend URL working: `curl https://[RAILWAY-URL]/api/health`
- [ ] Frontend connected to backend API
- [ ] Admin login works in production
- [ ] News/events creation works
- [ ] Database persists data

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **GitHub Repository**: https://github.com/kanukiir-afk/abyei
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md` for detailed instructions

---

## 🆘 Troubleshooting

**Build fails on Vercel?**
```bash
# Test locally first
cd apps/frontend && npm run build
```

**Backend won't connect to database?**
- Check `DATABASE_URL` in Railway Variables
- Ensure PostgreSQL service is running
- View Railway logs for errors

**Frontend can't reach backend?**
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check CORS settings in backend
- Test with: `curl https://[BACKEND-URL]/api/health`

**Permission denied errors?**
```bash
# Use sudo if needed
sudo vercel --prod
```

---

## 📝 Post-Deployment

1. **Test all features**: Register, login, add news/events
2. **Add custom domain** (optional):
   - Vercel: Settings → Domains
   - Railway: Not needed for backend
3. **Set up analytics**: Vercel → Analytics tab
4. **Enable auto-deploys**: Push to GitHub = auto-deploy

---

**Questions?** Check [Railway Docs](https://docs.railway.app) or [Vercel Docs](https://vercel.com/docs)
