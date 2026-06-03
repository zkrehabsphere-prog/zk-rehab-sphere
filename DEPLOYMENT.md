# Deployment Guide

This repository uses a monorepo structure with the frontend in `frontend/` and the backend served by a Vercel serverless function from `api/index.js`.

## Vercel Deployment (Recommended)

This project is designed to deploy as a single Vercel project using GitHub.

### Why this works

- Frontend is built by Vite and outputs to `../dist` from `frontend/vite.config.js`.
- Backend Express app lives in `backend/` and is exposed through `api/index.js`.
- `vercel.json` rewrites `/api/*` requests to the serverless function and sends all other routes to `index.html`.

### GitHub + Vercel setup

1.  **Push the repository to GitHub**
    - Ensure the full monorepo is committed, including:
      - `package.json` at repo root
      - `frontend/package.json`
      - `backend/package.json`
      - `vercel.json`
      - `api/index.js`

2.  **Create a new Vercel project**
    - Go to [vercel.com](https://vercel.com) and login with GitHub.
    - Click **New Project** and import the GitHub repository.

3.  **Set the project root**
    - Root Directory: `/` (repository root)
    - Install Command: `npm install`
    - Build Command: `npm run build`
    - Output Directory: `dist`
    - Framework Preset: `Other` or `Vite`

4.  **Add environment variables**
    In Vercel, configure both `Production` and `Preview` environments with the following values:

    - `MONGODB_URI` = your MongoDB connection string
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
    - `FRONTEND_URL` = `https://<your-vercel-domain>` (optional but recommended for backend CORS)
    - `VITE_API_URL` = `https://<your-vercel-domain>` or `https://<your-vercel-domain>/api`

    > Example: if your Vercel app is `https://zk-rehab-sphere.vercel.app`, set `VITE_API_URL` to `https://zk-rehab-sphere.vercel.app`.

5.  **Set Node version if needed**
    - Use Node 20 in Vercel if your backend package requires it.
    - In Vercel Project Settings, set `Node.js Version` to `20.x` or add a root `package.json` engine field if you want version control.

6.  **Deploy**
    - Save the settings and trigger a deploy.
    - Vercel will install dependencies from the root, run `npm run build`, and publish the frontend from `dist`.

### How routing works

- Static frontend routes are served from `dist`.
- API requests under `/api/*` are forwarded to `api/index.js`.
- `api/index.js` loads the Express app from `backend/server.js`.
- `vercel.json` contains the rewrite rules required for this behavior.

### Verify deployment

- Visit the deployed site URL.
- Check `/api/health` to verify the backend is reachable.
- Confirm the frontend can call backend APIs through the deployed domain.

## Recommended Vercel settings summary

- Root Directory: `/`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: `Other` or `Vite`
- Environment Variables: `MONGODB_URI`, `CLOUDINARY_*`, `FRONTEND_URL`, `VITE_API_URL`

## Manual build (optional)

If you want to build locally instead of using Vercel:

1.  Run `npm install` at the repo root.
2.  Run `npm run build`.
3.  The frontend static output will be in `dist`.
4.  Serve the contents of `dist` from a static host.
5.  Make sure backend APIs remain available separately if you are not using Vercel for the backend.
