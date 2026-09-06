# 🚀 Ashiana Deployment Guide: Render (Backend) & Vercel (Frontend)

Ye guide aapko **Ashiana Restaurant & Bakery** project ko **Render** aur **Vercel** par 5-10 minute me deploy karne ka complete step-by-step tareeka batati hai.

---

## 📌 Prerequisites
1. **GitHub Account:** [github.com](https://github.com)
2. **Render Account:** [render.com](https://render.com) (Free Tier available)
3. **Vercel Account:** [vercel.com](https://vercel.com) (Free Tier available)

---

##  Schritt 1: GitHub par Code Push Karna

Project root folder (`/var/www/html/Aashiyana`) me repository already initialized hai:

```bash
cd /var/www/html/Aashiyana

# 1. Sabhi files add karein
git add .

# 2. Commit karein
git commit -m "feat: ready for render and vercel deployment"

# 3. Main branch set karein
git branch -M main

# 4. GitHub par naya repo banayein (e.g. 'Aashiyana-Restaurant') aur link karein:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

# 5. Push karein
git push -u origin main
```

---

## 🟢 Schritt 2: Render par Backend Deploy Karna

1. **Render Dashboard** ([dashboard.render.com](https://dashboard.render.com)) par jayein.
2. Click **New +** ➔ Select **Web Service**.
3. Apna GitHub repository connect karein.
4. Niche diye gaye settings fill karein:
   - **Name:** `ashiana-backend`
   - **Region:** Any (e.g. *Singapore* ya *Frankfurt*)
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ *(Bohat zaroori hai)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
5. **Advanced Settings (Optional):**
   - **Health Check Path:** `/health`
   - **Environment Variables:**
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
6. Click **Create Web Service**.
7. Render 2-3 minute me build complete kar dega aur aapko ek live URL dega, jaise:
   👉 **`https://ashiana-backend.onrender.com`**

> [!TIP]
> Live URL ko browser me khol kar check karein. Aapko ye response milega:
> `{"status":"ok", "message":"Backend is active and serving requests for Shimla branches."}`

---

## ▲ Schritt 3: Vercel par Frontend Deploy Karna

1. **Vercel Dashboard** ([vercel.com/dashboard](https://vercel.com/dashboard)) par jayein.
2. Click **Add New...** ➔ Select **Project**.
3. Apna wahi GitHub repository select karke **Import** par click karein.
4. **Configure Project Settings:**
   - **Framework Preset:** `Angular` *(ya `Other`)*
   - **Root Directory:** Edit par click karke **`frontend`** select karein ⚠️
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/frontend/browser` *(frontend/vercel.json isko automatically handle karta hai)*
5. **Environment Variables (Optional / Recommended):**
   - Agar aap chahein to Vercel me direct Render URL set kar sakte hain:
     - **Key:** `ASHIANA_API_URL`
     - **Value:** `https://ashiana-backend.onrender.com/api` *(Step 2 wala apna Render URL dalein)*
6. Click **Deploy**.
7. 1-2 minute me Vercel aapki website ko live kar dega, jaise:
   👉 **`https://ashiana-restaurant.vercel.app`**

---

## 🔗 Schritt 4: Frontend ko Render Backend se Connect Karna

Aapke frontend me automatic smart API connector (`api.config.ts`) configured hai:

### Method A (Proxy via Vercel - Recommended & Zero CORS):
Aap `frontend/vercel.json` me apna Render URL direct add kar sakte hain:
```json
{
  "version": 2,
  "outputDirectory": "dist/frontend/browser",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://ashiana-backend.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Isse saari `/api/*` calls transparently Vercel se Render par forward ho jaayengi!

### Method B (Browser Console / LocalStorage - Instant Testing):
Website open karke browser console (`F12`) me simply ye command chala sakte hain:
```javascript
localStorage.setItem('ASHIANA_API_URL', 'https://ashiana-backend.onrender.com/api');
location.reload();
```
Ye turant Render backend se connect ho jayega bina kisi re-deploy ke!

---

## ✅ Deployment Summary Check

| Service | Platform | Root Directory | Build Command | Start/Output | Live Endpoint |
|---|---|---|---|---|---|
| **Backend API** | Render | `backend` | `npm install` | `node server.js` | `https://ashiana-backend.onrender.com` |
| **Frontend SPA** | Vercel | `frontend` | `npm run build` | `dist/frontend/browser` | `https://ashiana-restaurant.vercel.app` |

All set! Dono services cloud par production-ready hain.
