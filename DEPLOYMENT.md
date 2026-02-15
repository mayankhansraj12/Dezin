# Dezin AI - Two-Project Vercel Deployment

We will deploy the **Backend** and **Frontend** as two separate projects on Vercel. This is a robust and clean setup.

---

## Part 1: Deploy Backend (Project A)

1. **Push to GitHub** (IMPORTANT: Ensure you pushed the new `server/vercel.json` I just created).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import **Dezin**.
4. **Configure Project**:
   - **Project Name**: `dezin-backend`
   - **Root Directory**: Click "Edit" and select `server`.
   - **Framework Preset**: Other (Default).
   - **Environment Variables**:
     - `GEMINI_API_KEY`: *(Your Key)*
5. Click **Deploy**.
6. **Copy Payload URL**: Once deployed, copy the domain (e.g., `https://dezin-backend.vercel.app`).

*Note: Visiting the URL directly might show "Cannot GET /", but `/api` or `/health` should work.*

---

## Part 2: Deploy Frontend (Project B)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import **Dezin** (Again).
3. **Configure Project**:
   - **Project Name**: `dezin-client`
   - **Root Directory**: Click "Edit" and select `client`.
   - **Framework Preset**: Vite (Auto-detected).
   - **Environment Variables**:
     - `VITE_API_URL`: `https://dezin-backend.vercel.app` *(The URL from Part 1)*
4. Click **Deploy**.

---

## Summary
- **Backend Project**: Runs `server/` code as serverless functions (handled by `server/vercel.json`).
- **Frontend Project**: Runs `client/` code as a static site (handled by Vite).
- **Connection**: Frontend talks to Backend via `VITE_API_URL`.

You are all set! 🚀
