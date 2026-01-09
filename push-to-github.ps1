# PowerShell script to push Proverum to GitHub
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values

$username = "YOUR_USERNAME"
$repoName = "YOUR_REPO_NAME"

Write-Host "Setting up GitHub remote..." -ForegroundColor Green

# Add remote (if not already added)
git remote remove origin 2>$null
git remote add origin "https://github.com/$username/$repoName.git"

Write-Host "Renaming branch to main..." -ForegroundColor Green
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "`nDone! Your code has been pushed to GitHub." -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/$username/$repoName" -ForegroundColor Cyan
Write-Host "2. Go to Settings > Pages" -ForegroundColor Cyan
Write-Host "3. Select 'GitHub Actions' as the source" -ForegroundColor Cyan
Write-Host "4. Your site will be deployed automatically!" -ForegroundColor Cyan

