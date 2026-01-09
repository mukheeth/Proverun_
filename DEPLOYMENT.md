# Deployment Guide

This guide will help you deploy the Proverum application to GitHub.

## Prerequisites

1. A GitHub account
2. Git installed on your local machine
3. Node.js and npm installed (for local testing)

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., "proverum")
5. Choose visibility (Public or Private)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Make sure you're in the project root directory
cd C:\Users\mukee\Downloads\Proverum-main\Proverum-main

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: Proverum application"

# Add your GitHub repository as remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" (top menu)
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select:
   - **Source**: "GitHub Actions"
5. The deployment will happen automatically when you push to the main branch

## Step 4: Configure GitHub Pages (First Time Setup)

If this is your first time using GitHub Pages:

1. Go to repository Settings → Pages
2. Under "Build and deployment":
   - Source: Select "GitHub Actions"
3. The workflow will automatically deploy when you push to main/master branch

## Step 5: Access Your Deployed Application

After the GitHub Actions workflow completes (usually takes 2-5 minutes):

1. Go to your repository on GitHub
2. Click on "Settings" → "Pages"
3. You'll see the URL where your site is published
4. It will be in the format: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Troubleshooting

### Build Fails

If the GitHub Actions build fails:

1. Check the "Actions" tab in your repository
2. Click on the failed workflow run
3. Review the error messages
4. Common issues:
   - Missing dependencies (check package.json)
   - Build errors (check frontend code)
   - Node version mismatch

### Site Not Loading

If your site is deployed but not loading:

1. Check if the build completed successfully
2. Verify the GitHub Pages URL is correct
3. Wait a few minutes for DNS propagation
4. Check browser console for errors

### Routing Issues

If you're using React Router and routes aren't working:

1. Make sure you're using `BrowserRouter` (which we are)
2. For GitHub Pages, you may need to use `HashRouter` instead
3. Or configure a 404.html redirect (see GitHub Pages documentation)

## Manual Deployment

If you prefer to deploy manually:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Copy the `build` folder contents to the `gh-pages` branch or use a tool like `gh-pages`:
```bash
npm install -g gh-pages
cd frontend
gh-pages -d build
```

## Continuous Deployment

The included GitHub Actions workflow will automatically:
- Build your frontend when you push to main/master
- Deploy to GitHub Pages
- Run on every push and pull request

## Backend Deployment

The backend (FastAPI) needs to be deployed separately. Options include:

1. **Heroku**: Easy deployment for Python apps
2. **Railway**: Simple deployment with good free tier
3. **Render**: Free tier available
4. **AWS/DigitalOcean**: More control, requires more setup

For backend deployment, you'll need to:
- Set environment variables (MONGO_URL, DB_NAME)
- Configure CORS to allow your frontend domain
- Set up a MongoDB instance (MongoDB Atlas is recommended)

## Environment Variables

For production, make sure to:
- Set up environment variables in your hosting platform
- Never commit `.env` files to GitHub
- Use GitHub Secrets for sensitive data in CI/CD

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Review the error messages
3. Ensure all dependencies are correctly specified
4. Verify Node.js version compatibility

