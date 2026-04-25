# Deployment Guide: VibeMatch101

This guide outlines the steps to deploy your **VibeMatch101** frontend to **Vercel** (the recommended platform for Vite/React applications).

## Prerequisites
1. A **GitHub**, **GitLab**, or **Bitbucket** account.
2. A **Vercel** account (sign up at [vercel.com](https://vercel.com)).
3. Your project must be pushed to a remote repository.

---

## Step 1: Push Code to GitHub
If you haven't already, initialize a git repository and push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Optimized VibeMatch101"
# Create a repo on GitHub and follow their instructions to push:
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Step 2: Import Project to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** > **"Project"**.
3. Import your **VibeMatch101** repository.

## Step 3: Configure Build Settings
Vercel should auto-detect Vite. Ensure the following settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Step 4: Set Environment Variables
This is the most critical step. You must add the variables from your `.env` file to the Vercel project settings:
1. In the "Environment Variables" section, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon/Public Key.
2. Ensure you copy these exactly from your local `Frontend/.env` file.

## Step 5: Deploy
Click **"Deploy"**. Vercel will build your application and provide a production URL (e.g., `vibematch101.vercel.app`).

---

## Post-Deployment: Supabase Configuration
To ensure authentication and redirects work correctly in production:
1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication** > **URL Configuration**.
3. Add your Vercel URL to the **Additional Redirect URLs** (e.g., `https://vibematch101.vercel.app/**`).
4. Update the **Site URL** if you want this to be the primary address for email links.

---

## Handling Client-Side Routing
Since this is a Single Page Application (SPA), you need to handle routing fallbacks. Vercel handles this automatically if you use the default Vite preset, but if you encounter "404 on refresh" errors, create a `vercel.json` in your root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
