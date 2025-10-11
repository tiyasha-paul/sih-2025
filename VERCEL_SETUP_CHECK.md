# Vercel Setup Checklist - Fix 404 Errors

## 🚨 Current Issue: API endpoints returning 404

The API files are in your repository, but Vercel isn't serving them. This guide will help you fix it.

---

## Step 1: Check Vercel Dashboard Settings

### A. Go to Project Settings
1. Visit: **https://vercel.com/dashboard**
2. Click on **hydrolensv01** project
3. Click **Settings** tab

### B. Verify Build Settings
1. Go to **Settings** → **General**
2. Check these settings:

| Setting | Should Be |
|---------|-----------|
| Framework Preset | **Other** (or leave blank) |
| Build Command | (leave empty) |
| Output Directory | (leave empty) |
| Install Command | `npm install` or (leave empty) |

**If any are different, change them and redeploy!**

### C. Check Functions Settings
1. Go to **Settings** → **Functions**
2. Verify:
   - ✅ **Node.js Version**: 18.x or 20.x (latest)
   - ✅ **Region**: Closest to you
   - ✅ **Memory**: 1024 MB
   - ✅ **Max Duration**: 10s

---

## Step 2: Check Deployment Logs

### A. Go to Latest Deployment
1. **Vercel Dashboard** → **hydrolensv01**
2. Click **Deployments** tab
3. Click the **most recent deployment**

### B. Check Build Logs
1. Click **Build Logs** tab
2. Look for:

**Good signs ✅:**
```
✓ Deploying...
✓ Building...
✓ Serverless Functions
  - api/index.js
  - api/metadata.js
  - api/query.js
✓ Deployment Ready
```

**Bad signs ❌:**
```
Warning: No serverless functions detected
Error: Build failed
No api folder found
```

### C. Check Functions Tab
1. Click **Functions** tab on the deployment page
2. You should see:
   - `/api/index`
   - `/api/metadata`
   - `/api/query`

**If you DON'T see these, Vercel isn't detecting your functions!**

---

## Step 3: Force Redeploy

Sometimes Vercel needs a fresh start:

### Option A: From Dashboard
1. Go to **Deployments** tab
2. Find latest deployment
3. Click **"..."** (three dots)
4. Click **"Redeploy"**
5. Check **"Use existing Build Cache"** → **OFF** (disable cache)
6. Click **"Redeploy"**

### Option B: From Git
```bash
git commit --allow-empty -m "Force Vercel redeploy"
git push origin master
```

---

## Step 4: Check Repository Connection

### A. Verify Git Integration
1. **Settings** → **Git**
2. Check:
   - ✅ Connected to correct repository
   - ✅ Connected to correct branch (`master`)
   - ✅ Production branch is `master`

### B. Check Build Trigger
1. Make sure "Ignored Build Step" is **NOT** enabled
2. **Settings** → **Git** → **Ignored Build Step**
3. Should be blank or `$VERCEL_GIT_COMMIT_MESSAGE`

---

## Step 5: Manual Test

### Test API Detection Locally with Vercel CLI

If you want to test locally first:

```bash
# Install Vercel CLI
npm i -g vercel

# Go to project folder
cd d:\bin\sih-2025-main

# Run locally
vercel dev
```

Then visit: `http://localhost:3000/api/index`

**If it works locally but not on Vercel, it's a deployment configuration issue.**

---

## Step 6: Check for Common Issues

### Issue 1: API folder not in root
**Fix**: Make sure `api/` folder is in the root of your repository, not in a subfolder.

```
✅ Correct:
sih-2025-main/
├── api/
│   ├── index.js
│   ├── metadata.js
│   └── query.js
├── index.html
└── vercel.json

❌ Wrong:
sih-2025-main/
└── subfolder/
    └── api/
        └── index.js
```

### Issue 2: Wrong Node.js version
**Fix**:
1. **Settings** → **General** → **Node.js Version**
2. Select **18.x** or **20.x**
3. Redeploy

### Issue 3: Package.json conflicts
**Fix**: Check if `package.json` has any scripts that interfere:

```json
{
  "scripts": {
    "build": "echo no build needed"
  }
}
```

Remove any unnecessary build scripts.

### Issue 4: Vercel ignoring files
**Fix**: Check if there's a `.vercelignore` file blocking `/api`:

```bash
# Check
cat .vercelignore

# If it mentions 'api', remove that line
```

---

## Step 7: Alternative - Use Different Routes

If Vercel still won't detect `/api`, try renaming:

1. Rename `api/` folder to `functions/`
2. Update `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/functions/$1" }
  ]
}
```

---

## Step 8: Nuclear Option - Delete and Reconnect

If nothing works:

1. **Vercel Dashboard** → **Settings** → **Advanced**
2. Scroll to bottom
3. Click **"Delete Project"**
4. **WARNING**: This will delete all deployments!
5. Then reconnect the repository as a new project

---

## Quick Diagnostic Test

After any changes, test with the diagnostic page:

**https://hydrolensv01.vercel.app/test-api.html**

This will test all API endpoints and show you exactly what's working and what's not.

---

## Most Likely Causes

Based on persistent 404s, the issue is usually:

1. **Vercel isn't detecting the `/api` folder** (60% chance)
   - Fix: Force redeploy with cache cleared

2. **Wrong build settings** (30% chance)
   - Fix: Reset build settings to defaults

3. **Git not pushing api folder** (5% chance)
   - Fix: Already verified this is fine

4. **Vercel account/project issue** (5% chance)
   - Fix: Contact Vercel support or recreate project

---

## Next Steps

1. ✅ Check Vercel build logs (Step 2)
2. ✅ Force redeploy without cache (Step 3)
3. ✅ Visit test page: `/test-api.html`
4. ✅ Check Functions tab for listed endpoints

If after doing ALL of the above, you still get 404:

**Share with me:**
1. Screenshot of Vercel Functions tab
2. Screenshot of Vercel Build Logs
3. Screenshot of test-api.html results

This will help me diagnose the exact issue!

---

**Most important**: Go to Vercel → Deployments → Latest → Functions tab and see if `/api/index`, `/api/metadata`, and `/api/query` are listed there. If NOT, Vercel isn't detecting them.
