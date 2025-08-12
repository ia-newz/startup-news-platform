@echo off
REM Build script for Innovations Arena Frontend (Windows)
REM This script helps with Docker builds and troubleshooting

echo 🚀 Starting build process for Innovations Arena Frontend...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the frontend directory.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo 📦 Node.js version: %NODE_VERSION%

REM Check npm version
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo 📦 npm version: %NPM_VERSION%

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"
if exist "out" rmdir /s /q "out"

REM Install dependencies
echo 📥 Installing dependencies...
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Run linting
echo 🔍 Running linting...
call npm run lint
if errorlevel 1 (
    echo ❌ Linting failed
    pause
    exit /b 1
)

REM Build the application
echo 🔨 Building application...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Check build output
if exist ".next" (
    echo 📁 Build output found in .next directory
    echo 🎉 Build process completed successfully!
    echo 🚀 You can now run 'npm start' to start the production server
    echo 🐳 Or use 'docker build .' to build the Docker image
) else (
    echo ❌ Build output not found
    pause
    exit /b 1
)

pause
