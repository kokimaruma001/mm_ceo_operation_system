# GitHub Pages Deployment Guide

Your Marker Media CEO Operation System is now configured for GitHub Pages deployment!

## Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys your app when you push to the `main` branch.

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Choose `gh-pages` as the branch
   - Set folder to `/ (root)`
   - Click Save

2. **Push your changes:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **View the workflow:**
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow run
   - Once complete (green checkmark), your app is live!

### Your GitHub Pages URL:
```
https://kokimaruma001.github.io/mm_ceo_operation_system/
```

---

## Manual Deployment

If you prefer to deploy manually:

### Build the app:
```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy options:

**Option A: Using GitHub Pages UI**
1. Go to **Settings** → **Pages**
2. Select **Deploy from a branch** as the source
3. Push the `dist` folder or use a branch with the dist contents

**Option B: Use a GitHub Pages deployment action**
The workflow file (`.github/workflows/deploy.yml`) handles this automatically!

---

## Features Enabled:

✅ **Automatic builds** on every push to `main`  
✅ **Optimized production builds** with minification  
✅ **Code splitting** for better performance  
✅ **Correct base path** configuration for subdirectory hosting  
✅ **Asset versioning** for cache busting  

## Troubleshooting:

**Issue: App shows 404 not found**
- Verify the `base: '/mm_ceo_operation_system/'` is set in `vite.config.js`
- Clear your browser cache (Ctrl+Shift+Delete)
- Wait 5 minutes after deployment for GitHub Pages to fully update

**Issue: Workflow fails to deploy**
- Check GitHub Actions logs in the **Actions** tab
- Ensure GitHub Pages is set to deploy from `gh-pages` branch
- Verify Pages is enabled in repository Settings

**Issue: Assets not loading**
- The workflow file uploads to the Pages artifact correctly
- If manually deploying, ensure the entire `dist` folder is deployed

---

## Next Steps:

1. Commit and push this configuration to GitHub
2. Enable GitHub Pages in your repository settings
3. Your app will be live in minutes!

For more info: [GitHub Pages Documentation](https://docs.github.com/en/pages)
