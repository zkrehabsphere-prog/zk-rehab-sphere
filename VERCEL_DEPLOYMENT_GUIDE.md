# Complete Vercel Deployment Guide - ZK Rehab Sphere

## ✅ Pre-Deployment Checklist (Completed)
- [x] Project builds successfully locally (`npm run build`)
- [x] Git repository is up-to-date with GitHub (`main` branch)
- [x] `.env.example` file is configured with all required variables
- [x] MongoDB connection string (MongoDB Atlas) - Ready ✓
- [x] Cloudinary credentials - Ready ✓
- [x] Frontend configuration points to correct API URL

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Verify Your GitHub Repository
1. Go to your GitHub profile
2. Find your ZK Rehab Sphere repository
3. Verify that all code is pushed to the `main` branch
4. Make note of the repository URL (e.g., `https://github.com/yourusername/ZK_Rehab_Sphere_Project`)

---

### Step 2: Create Vercel Account and Project
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up or log in** with GitHub
3. **Click "New Project"** button
4. **Select your GitHub repository:**
   - Find "ZK_Rehab_Sphere_Project"
   - Click "Import"

---

### Step 3: Configure Vercel Build Settings
When Vercel shows the project configuration screen, set:

#### Root Directory
- **Set to:** `/` (repository root, not frontend or backend)

#### Build Command
- **Set to:** `npm run build`

#### Output Directory  
- **Set to:** `dist`

#### Framework
- **Set to:** `Other` (or `Vite` if available)

#### Install Command
- **Set to:** `npm install`

**Then click "Deploy"** (or "Save" if there's a two-step process)

---

### Step 4: Configure Environment Variables
After project creation, go to **Project Settings → Environment Variables**

Add the following variables for both **Production** and **Preview** environments:

```
MONGODB_URI = "mongodb+srv://username:password@cluster0.mongodb.net/zk_rehab_sphere?retryWrites=true&w=majority"

CLOUDINARY_CLOUD_NAME = "your-cloud-name"

CLOUDINARY_API_KEY = "your-api-key"

CLOUDINARY_API_SECRET = "your-api-secret"

VITE_API_URL = "https://your-vercel-domain.vercel.app"

FRONTEND_URL = "https://your-vercel-domain.vercel.app"

NODE_ENV = "production"
```

**Important:** 
- Replace `your-vercel-domain` with your actual Vercel domain (will be shown after deployment)
- Use the actual MongoDB URI from MongoDB Atlas
- Use real Cloudinary credentials

---

### Step 5: Set Node.js Version (Optional but Recommended)
If you want to explicitly set Node version to 20:

1. Go to **Project Settings → General**
2. Find **Node.js Version**
3. Select **20.x**

---

### Step 6: Trigger Initial Deployment
1. After saving environment variables, go to the **Deployments** tab
2. Click on the latest deployment (or click **Redeploy** button)
3. Wait for the deployment to complete (usually 2-5 minutes)
4. Once complete, click **Visit** to view your live site

---

## 🔍 Verification Checklist

After deployment, verify everything works:

### ✓ Frontend is Loading
- [ ] Visit your Vercel domain (e.g., `https://zk-rehab-sphere.vercel.app`)
- [ ] Page loads without errors
- [ ] Images and styling display correctly
- [ ] No JavaScript console errors (open DevTools with F12)

### ✓ API Backend is Working
- [ ] Visit `https://your-domain.vercel.app/api/health`
- [ ] Should return: `{"status":"ok","timestamp":"...","environment":"production"}`

### ✓ Database Connection
- [ ] Try logging in or creating a profile
- [ ] Check that data saves to MongoDB Atlas
- [ ] Verify no 500 errors in the backend

### ✓ Frontend-Backend Communication
- [ ] Try the appointment booking feature
- [ ] Upload an expert photo (tests Cloudinary)
- [ ] Create a blog post (tests database write)
- [ ] Verify all forms work correctly

### ✓ Static Files & Assets
- [ ] All images load properly
- [ ] Logo and icons display
- [ ] CSS is applied correctly
- [ ] No 404 errors for assets

---

## 🚀 Post-Deployment Configuration

### Add Custom Domain (Optional)
1. Go to **Project Settings → Domains**
2. Add your custom domain (e.g., `zkrehabsphere.com`)
3. Update DNS records as instructed by Vercel

### Enable HTTPS (Automatic)
- Vercel automatically provides HTTPS certificate for all deployments

### Configure CORS (If Needed)
- Backend already has CORS configured for production
- Update `allowedOrigins` in [backend/server.js](backend/server.js#L54) if needed

---

## 🔐 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb+srv://...` |
| `CLOUDINARY_CLOUD_NAME` | Image upload service | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Your API key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | Your secret |
| `VITE_API_URL` | Frontend API base URL | `https://app.vercel.app` |
| `FRONTEND_URL` | Backend CORS origin | `https://app.vercel.app` |
| `NODE_ENV` | Environment type | `production` |

---

## 📊 Project Structure for Vercel

```
Repository Root/
├── package.json                 (Root package with workspaces)
├── vercel.json                  (Vercel configuration ✓)
├── .env.example                 (Environment template ✓)
├── frontend/
│   ├── package.json            (Frontend dependencies)
│   ├── vite.config.js          (Builds to ../dist ✓)
│   └── src/                     (React application)
├── backend/
│   ├── package.json            (Backend dependencies)
│   ├── server.js               (Express app ✓)
│   └── routes/                 (API endpoints)
└── api/
    └── index.js                (Vercel serverless entry point ✓)
```

---

## 🆘 Troubleshooting

### ❌ Build Fails with "MONGODB_URI not found"
- Go to Project Settings → Environment Variables
- Ensure `MONGODB_URI` is set for both Production AND Preview
- Redeploy after adding variables

### ❌ Frontend shows blank page
- Check browser console (F12) for errors
- Verify `VITE_API_URL` is set correctly
- Check that `dist` folder exists and has `index.html`

### ❌ API returns 500 errors
- Check Vercel logs: Deployments tab → Details → Function logs
- Verify MongoDB connection string is correct
- Ensure all required environment variables are set

### ❌ Images not loading / Cloudinary errors
- Verify `CLOUDINARY_*` variables are correct
- Check that Cloudinary account is active
- Verify credentials have upload permission

### ❌ CORS errors in browser console
- Ensure `FRONTEND_URL` in backend matches your Vercel domain
- Restart deployment after updating environment variables
- Check browser console for exact CORS error message

---

## 📞 Getting Help

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Cloudinary:** https://cloudinary.com/documentation
- **Firebase:** https://firebase.google.com/docs

---

## ✨ Final Notes

1. **Your app will be at:** `https://[project-name].vercel.app`
2. **Deployment time:** Usually 2-5 minutes for initial build
3. **Automatic deployments:** Every push to `main` branch triggers auto-deployment
4. **Custom domain:** You can add your custom domain for free
5. **Scaling:** Vercel automatically scales your backend with traffic

**Your deployment is ready! Follow the steps above to go live! 🚀**
