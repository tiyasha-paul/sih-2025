# Troubleshooting HydroLens Serverless Deployment

## Current Issue: "Error contacting visualization server"

### What's Happening

Your serverless functions are deployed, but they might not be working yet. This is common with Vercel deployments and has several possible causes.

---

## Solution 1: Wait for Deployment (Most Common)

**Vercel takes 2-5 minutes to deploy changes.**

### Check Deployment Status:
1. Go to: **https://vercel.com/dashboard**
2. Click on your **hydrolensv01** project
3. Look for deployment status:
   - 🟡 **Building** - Wait
   - 🟡 **Deploying** - Wait
   - 🟢 **Ready** - Try your site again!

### After Status Shows "Ready":
1. **Hard refresh** your browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Try your query again: "show trend for Delhi 2024"

---

## Solution 2: Check Browser Console

### How to Open Console:
- **Chrome/Edge**: Press `F12` → Click "Console" tab
- **Firefox**: Press `F12` → Click "Console" tab

### What to Look For:

#### Good Signs ✅
```
Calling /api/query with: {query: "show trend for Delhi 2024", lang: "English"}
API Response status: 200
API Response: {query: "...", answer: "...", ...}
```

#### Bad Signs ⚠️
```
API fetch error: TypeError: Failed to fetch
Server error: 404
Server error: 500
```

### If You See 404 Error:
- API route not found
- Vercel hasn't deployed the `/api` folder yet
- **Fix**: Wait 2-3 more minutes, then refresh

### If You See 500 Error:
- Server error in the Python function
- **Fix**: Check Vercel function logs (see Solution 3)

### If You See "Failed to fetch":
- Network issue or CORS problem
- **Fix**: Hard refresh browser, check internet connection

---

## Solution 3: Check Vercel Function Logs

### Steps:
1. Go to: **https://vercel.com/dashboard**
2. Click on **hydrolensv01** project
3. Click on the latest deployment (should say "Ready")
4. Click **"Functions"** tab
5. Look for errors in:
   - `/api/query`
   - `/api/metadata`

### Common Errors:

#### "Module not found"
**Problem**: Missing dependency
**Fix**: Check that `requirements.txt` is in the root folder

#### "Function timeout"
**Problem**: Function took > 10 seconds
**Fix**: This shouldn't happen with current lightweight code. If it does, contact support.

#### "File not found: data.json"
**Problem**: Data file path is wrong
**Fix**: Ensure `CHAT/data.json` exists in your repository

---

## Solution 4: Test API Directly

### Test if API is working:

1. **Open a new browser tab**
2. **Go to**: `https://hydrolensv01.vercel.app/api/metadata`

### Expected Result:
You should see a JSON response like:
```json
{
  "DELHI_DELHI_2024-25": {
    "location": "DELHI",
    "state": "DELHI",
    "year": "2024-25",
    ...
  }
}
```

### If You See:
- ✅ **JSON data** → API works! Problem is in frontend.
- ❌ **404 Not Found** → API not deployed yet. Wait and refresh.
- ❌ **500 Error** → Check function logs (Solution 3)
- ❌ **Blank page** → CORS issue or network problem

---

## Solution 5: Clear Vercel Cache

Sometimes Vercel caches old builds.

### Steps:
1. Go to: **https://vercel.com/dashboard**
2. Click **hydrolensv01** project
3. Click **Settings** → **General**
4. Scroll down to **"Build & Development Settings"**
5. Look for **"Clear Cache"** or trigger a new deployment:
   - Go to **Deployments** tab
   - Click the **"•••"** menu on latest deployment
   - Click **"Redeploy"**

---

## Solution 6: Manual Test with Query

### Try this in browser console:

```javascript
fetch('https://hydrolensv01.vercel.app/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'show trend for Delhi 2024', lang: 'English' })
})
.then(res => res.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

### Expected Response:
```json
{
  "query": "show trend for Delhi 2024",
  "location": "DELHI",
  "state": "DELHI",
  "year": "2024",
  "query_type": "trend",
  "answer": "📈 Groundwater Extraction Trend for DELHI...",
  "graph": null
}
```

---

## Solution 7: Fallback to Local Search

If the API still doesn't work, the chat interface has a **built-in local search** that doesn't need the API!

### How to Use:
Instead of: `"show trend for Delhi 2024"`

Try exact location names:
- `"Delhi 2024"`
- `"Rohini"`
- `"Mayur Vihar"`

The local search will find matching records without needing the serverless API.

---

## Solution 8: Check GitHub Repository

Make sure all files are pushed:

```bash
git status
```

Should show:
```
On branch master
Your branch is up to date with 'origin/master'.
nothing to commit, working tree clean
```

### If not:
```bash
git add .
git commit -m "Update serverless functions"
git push origin master
```

---

## Solution 9: Verify File Structure

Your project should look like this:

```
sih-2025-main/
├── api/
│   ├── query.py          ← Serverless function
│   └── metadata.py       ← Serverless function
├── CHAT/
│   └── data.json         ← Data file
├── chat.html
├── index.html
├── vercel.json           ← Vercel config
└── requirements.txt      ← Python deps (can be empty)
```

### If files are missing or in wrong location:
Move them to correct locations and push again.

---

## Still Not Working?

### Quick Workaround:
Use the **local search feature** - it works without the API!

Just type location names directly:
- `"Delhi"`
- `"Rohini 2024"`
- `"West Bengal 2023"`

### For Full Functionality:
1. **Double-check Vercel deployment status** (must say "Ready")
2. **Wait 5 full minutes** after pushing (sometimes takes longer)
3. **Hard refresh browser**: `Ctrl + Shift + R`
4. **Clear browser cache**: Settings → Privacy → Clear browsing data
5. **Try incognito/private window**: Rules out cache issues

---

## Getting Help

### Check These:
1. ✅ Vercel deployment status: "Ready"
2. ✅ All files committed and pushed
3. ✅ Browser console shows no errors
4. ✅ API endpoint test returns JSON: `https://hydrolensv01.vercel.app/api/metadata`

### If all above are ✅ but still not working:
1. Check Vercel function logs for errors
2. Try redeploying from Vercel dashboard
3. Contact Vercel support (they're very helpful!)

---

## Timeline Expectations

| Action | Time | What Happens |
|--------|------|--------------|
| `git push` | 0 min | Code pushed to GitHub |
| Vercel detects push | 30 sec | Build starts |
| Building | 1-2 min | Installing dependencies, building functions |
| Deploying | 1-2 min | Uploading to CDN |
| **Ready** | **2-5 min** | **Site is live!** |
| Cold start (first request) | +5 sec | Serverless function wakes up |

**Total time from push to working**: **3-6 minutes**

---

## Success Checklist

When it's working, you should see:

✅ Chat page loads instantly
✅ "Dataset loaded — 1668 keys available" message
✅ Query "show trend for Delhi 2024" returns a response
✅ No errors in browser console
✅ Metadata loads at `/api/metadata`

---

**Most issues resolve themselves after waiting 5 minutes and doing a hard refresh!** 🚀
