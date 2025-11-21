---
description: How to deploy MyGF AI for free using Vercel, Render, and MongoDB Atlas.
---

# 🚀 Deployment Guide: MyGF AI (Free Tier)

This guide will help you deploy your full-stack application for free so you can share a live link with investors.

## Prerequisite: GitHub
Ensure your code is pushed to GitHub (you just did this!).

---

## Step 1: Database (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2.  Create a **New Cluster** (Select "Shared" -> "M0 Sandbox" for Free Tier).
3.  **Database Access:** Create a database user (e.g., `admin`) and password. **Save this password!**
4.  **Network Access:** Add IP Address `0.0.0.0/0` (Allow Access from Anywhere).
5.  **Connect:** Click "Connect" -> "Drivers" -> Copy the **Connection String**.
    *   It looks like: `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<password>` with your actual password.

---

## Step 2: Backend (Render.com)
1.  Go to [Render.com](https://render.com/) and sign up with GitHub.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your `MyGF-AI` repository.
4.  **Configuration:**
    *   **Name:** `mygf-ai-backend`
    *   **Root Directory:** `backend` (Important!)
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
    *   **Instance Type:** Free
5.  **Environment Variables:** (Scroll down to "Advanced")
    *   Add `MONGO_URI`: Paste your MongoDB Connection String from Step 1.
    *   Add `JWT_SECRET`: Type a random secret word (e.g., `mysecretkey123`).
    *   Add `NODE_ENV`: `production`
6.  Click **"Create Web Service"**.
7.  **Wait:** It will take a few minutes. Once live, copy the **Service URL** (e.g., `https://mygf-ai-backend.onrender.com`).

---

## Step 3: Frontend (Vercel)
1.  Go to [Vercel.com](https://vercel.com/) and sign up with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `MyGF-AI` repository.
4.  **Configuration:**
    *   **Framework Preset:** Vite (Should detect automatically).
    *   **Root Directory:** `./` (Default).
5.  **Environment Variables:**
    *   Add `VITE_API_URL`: Paste your **Render Backend URL** from Step 2 (e.g., `https://mygf-ai-backend.onrender.com`).
    *   Add `VITE_GEMINI_API_KEY`: Paste your Google Gemini API Key.
6.  Click **"Deploy"**.

---

## 🎉 Done!
Vercel will give you a live link (e.g., `https://mygf-ai.vercel.app`).
**Send this link to your investors!**
