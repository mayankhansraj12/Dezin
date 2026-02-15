# Dezin AI - Two-Project Vercel Deployment

We will deploy the **Backend** and **Frontend** as two separate projects on Vercel. This is a robust and clean setup.

---

## Part 1: Deploy Backend (Project A)

1. **Push to GitHub** (IMPORTANT: Ensure you pushed the new `server/vercel.json` file).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. **Configure Project**:
   - **Project Name**: `your-backend-project`
   - **Root Directory**: Click "Edit" and select `server`.
   - **Framework Preset**: Other (Default).
   - **Environment Variables**:
     - `GEMINI_API_KEY`: *(Your actual Google API Key)*
5. Click **Deploy**.
6. **Copy Payload URL**: Once deployed, copy the domain (e.g., `https://your-backend-project.vercel.app`).

*Note: Visiting the URL directly might show "Cannot GET /", but `/api` or `/health` should work.*

---

## Part 2: Deploy Frontend (Project B)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your repository (Again).
3. **Configure Project**:
   - **Project Name**: `your-frontend-project` (e.g., `dezin-client`)
   - **Root Directory**: Click "Edit" and select `client`.
   - **Framework Preset**: Vite (Auto-detected).
   - **Environment Variables**:
     - `VITE_API_URL`: `https://your-backend-project.vercel.app` *(The URL you copied from Part 1)*
4. Click **Deploy**.

---

## Summary
- **Backend Project**: Runs `server/` code as serverless functions (handled by `server/vercel.json`).
- **Frontend Project**: Runs `client/` code as a static site (handled by Vite).
- **Connection**: Frontend talks to Backend via the `VITE_API_URL` environment variable.

You are all set! 🚀
