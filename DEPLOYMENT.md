# Dezin AI - Deployment Guide

## 🚀 Recommended Deployment Options

### Option 1: Vercel (Easiest & Recommended) ⭐

This project is pre-configured for Vercel with a `vercel.json` file that handles both the frontend and backend serverless functions automatically.

#### Steps:
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a repo on GitHub, then:
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - **Environment Variables**: Add `GEMINI_API_KEY` (copy value from your local `.env`)
   - **Framework Preset**: Vercel should auto-detect "Vite" for the frontend.
   - Click **Deploy**

3. **That's it!** 
   - Vercel will build the frontend
   - It will deploy the backend as Serverless Functions (handled by `vercel.json`)
   - Your app will be live at `https://your-project.vercel.app`

---

### Option 2: Render (For Persistent Backend)

Use this if you prefer a traditional server over serverless functions.

#### 1. Backend Service (Web Service)
- **New Web Service** → Connect Repo
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Environment Variables**:
  - `GEMINI_API_KEY`: (your key)
  - `NODE_ENV`: `production`
  - `FRONTEND_URL`: `https://your-frontend-app.onrender.com` (add this AFTER creating frontend)

#### 2. Frontend Service (Static Site)
- **New Static Site** → Connect Repo
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-backend-service.onrender.com` (URL from step 1)

---

## 🔑 Environment Variables Checklist

| Variable | Description | Where to set |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Your Google AI API Key | Server (Vercel/Render) |
| `NODE_ENV` | Set to `production` | Server (Auto on Vercel) |
| `FRONTEND_URL` | Your frontend domain | Server (For CORS security) |
| `VITE_API_URL` | Your backend URL | Client (Only if using Render) |

---

## 🛠️ Project Structure for Reference

```
Dezin/
├── vercel.json      # Handles Vercel routing (api -> server, * -> client)
├── package.json     # Root scripts
├── client/          # Frontend (Vite + React)
│   └── dist/        # Build output
└── server/          # Backend (Express)
    └── index.js     # Server entry point
```

## 🐛 Troubleshooting

- **CORS Errors?** Check `FRONTEND_URL` env var on your server.
- **API Errors?** Check `GEMINI_API_KEY` on your server.
- **Build Fails?** Ensure you are running `npm install` in the correct directory.
