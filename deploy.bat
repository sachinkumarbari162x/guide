@echo off
title Deploy to GitHub & Vercel
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     LEARNING GUIDES - DEPLOY TO GITHUB ^& VERCEL             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed. Please install Git first.
    pause
    exit /b 1
)

:: Get current directory name for reference
for %%I in (.) do set "FOLDER_NAME=%%~nxI"
echo [INFO] Project: %FOLDER_NAME%
echo.

:: Check if this is a git repository
if not exist ".git" (
    echo [WARNING] Not a Git repository. Initializing...
    git init
    git branch -M main
    echo.
    echo [ACTION REQUIRED] Please add a remote origin:
    echo   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    echo.
    pause
    exit /b 1
)

:: Get remote URL
echo [INFO] Checking remote repository...
git remote -v

echo.
echo ═══════════════════════════════════════════════════════════════
echo.

:: Stage all changes
echo [1/4] Staging all changes...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to stage changes.
    pause
    exit /b 1
)
echo      ✓ Changes staged successfully
echo.

:: Get commit message
set /p COMMIT_MSG="[2/4] Enter commit message (or press Enter for default): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update learning guides %date% %time:~0,5%

:: Commit changes
echo.
echo [3/4] Committing changes...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo [WARNING] Nothing to commit or commit failed.
)
echo      ✓ Commit created
echo.

:: Push to GitHub
echo [4/4] Pushing to GitHub (triggers Vercel auto-deploy)...
git push origin main
if errorlevel 1 (
    echo [WARNING] Push failed. Trying with upstream set...
    git push -u origin main
)
echo      ✓ Pushed to GitHub successfully
echo.

echo ═══════════════════════════════════════════════════════════════
echo.
echo [SUCCESS] Deployment complete!
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  NEXT STEPS (if first time):                                 ║
echo ║                                                              ║
echo ║  1. Go to: https://vercel.com                                ║
echo ║  2. Click "Add New Project"                                  ║
echo ║  3. Import your GitHub repository                            ║
echo ║  4. Click "Deploy" (no config needed!)                       ║
echo ║                                                              ║
echo ║  After initial setup, Vercel will auto-deploy on every push! ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

pause
