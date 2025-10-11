# HydroLens - Vercel Serverless Deployment Guide

## Overview
HydroLens has been configured to run completely on Vercel's serverless infrastructure. No local server setup or .bat files are needed - everything runs automatically in the cloud!

## What Changed

### ✅ New Features
- **Automatic Backend**: Server runs automatically when anyone visits your website
- **Serverless APIs**: Python Flask backend converted to Vercel serverless functions
- **Global Access**: Works from anywhere without local setup
- **No Installation**: Visitors don't need to install Python or dependencies

### 📁 Files Added
1. `vercel.json` - Vercel deployment configuration
2. `requirements.txt` - Python dependencies for serverless functions
3. `api/query.py` - Serverless endpoint for groundwater queries
4. `api/metadata.py` - Serverless endpoint for metadata

### 🔧 Files Modified
1. `index.html` - Removed local server auto-start code
2. `chat.html` - Updated to use serverless API endpoints (`/api/query` and `/api/metadata`)

## Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure HydroLens for Vercel serverless deployment"
git push origin master
```

### Step 2: Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your repository: `sih-2025`
5. Configure project settings:
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: `.`
   - **Install Command**: `pip install -r requirements.txt`

### Step 3: Add Environment Variables (If needed)
If you're using Google Gemini API:
1. Go to Project Settings → Environment Variables
2. Add: `GOOGLE_API_KEY` = your API key

### Step 4: Deploy
Click "Deploy" and wait for deployment to complete (2-3 minutes)

## How It Works

### Architecture
```
User Browser
    ↓
Vercel CDN (Static HTML/CSS/JS)
    ↓
Vercel Serverless Functions (Python)
    ↓
Data Processing & Response
```

### API Endpoints
- `GET /api/metadata` - Returns groundwater metadata
- `POST /api/query` - Processes user queries and returns data/visualizations

### Request Flow
1. User visits website → Vercel serves static files instantly
2. User enters query → Frontend calls `/api/query`
3. Serverless function processes query → Returns JSON response
4. Frontend displays results

## Testing Locally (Optional)

To test serverless functions locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run local development server
vercel dev
```

Then visit `http://localhost:3000`

## Vercel Limits (Free Tier)

- ✅ Serverless Function Execution: 100GB-Hours/month
- ✅ Serverless Function Duration: 10 seconds max
- ✅ Deployments: Unlimited
- ✅ Bandwidth: 100GB/month
- ✅ Custom domains: Unlimited

These limits are more than enough for HydroLens!

## Troubleshooting

### Issue: "Function execution timed out"
**Solution**: Large ML models may exceed the 10-second limit. Consider:
- Using lighter models
- Caching results
- Upgrading to Vercel Pro ($20/month for 60-second timeouts)

### Issue: "Module not found"
**Solution**: Ensure all dependencies are in `requirements.txt`

### Issue: API returns 404
**Solution**: Check that API files are in the `/api` folder and properly named

## Features Currently Supported

✅ Groundwater data queries
✅ Location-based searches
✅ Metadata retrieval
✅ Multi-language support
✅ Category and trend query responses

## Features Not Yet Supported (Requires Local Server)

⚠️ Live visualization generation (matplotlib graphs)
- Reason: Requires matplotlib which is too large for serverless functions
- Workaround: Responses describe what the visualization would show

## Upgrading Visualization Support

To enable live visualizations on serverless:

### Option A: Pre-generate Static Images
Store pre-generated charts in `/public/charts/` and serve them

### Option B: Use Chart.js
Convert backend matplotlib charts to Chart.js (client-side rendering)

### Option C: External Service
Use services like QuickChart.io or Plotly Chart Studio

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all features on production URL
3. 🔄 Update DNS (if using custom domain)
4. 🔄 Add Chart.js for client-side visualizations
5. 🔄 Implement caching for faster responses

## Support

For issues or questions:
- Check Vercel deployment logs
- Review API responses in browser console
- Test endpoints directly: `https://your-site.vercel.app/api/query`

---

**🎉 Your HydroLens application is now fully serverless and accessible globally!**

No more .bat files, no more local servers, no more setup hassles. Just visit the URL and it works! 🌊
