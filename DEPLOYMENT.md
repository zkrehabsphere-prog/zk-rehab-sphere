# Deployment Guide

This project is ready to be deployed to popular static hosting providers like Vercel. Configuration files (`vercel.json`) have been added to handle Single Page Application (SPA) routing.

## Option 1: Vercel (Recommended)

Vercel is optimized for frontend frameworks and offers a seamless deployment experience.

### Steps:
1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Sign up/Login**: Go to [vercel.com](https://vercel.com) and sign up with GitHub.
3.  **Add New Project**:
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your `zk-rehab-sphere` repository.
4.  **Configure**:
    *   **Framework Preset**: Select **Vite**.
    *   **Root Directory**: Ensure it's set to the root (default).
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
5.  **Deploy**: Click **"Deploy"**.

Vercel will detect the `vercel.json` file and automatically configure routing.


## Manual Build (for other providers)

If you are using a different provider (e.g., GitHub Pages, AWS S3):

1.  Run `npm run build` locally.
2.  The output will be in the `dist` folder.
3.  Upload the contents of the `dist` folder to your web server.
4.  *Note: You may need to configure your server to redirect all requests to `index.html` for routing to work.*
