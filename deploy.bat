@echo off
REM Deployment script for Hostinger - Build and prepare files

echo.
echo ====================================
echo AI Udaan Bootcamp - Deployment Script
echo ====================================
echo.

REM Check if Node modules exist
if not exist "node_modules" (
    echo [1/4] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        exit /b 1
    )
) else (
    echo [1/4] Dependencies already installed, skipping npm install
)

echo [2/4] Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generation failed
    exit /b 1
)

echo [3/4] Building Next.js application...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    exit /b 1
)

echo [4/4] Creating deployment folder...
if exist "deploy_bundle" rmdir /s /q deploy_bundle
mkdir deploy_bundle

echo.
echo ====================================
echo Copying files for deployment...
echo ====================================

REM Copy all necessary files
xcopy /E /I /Y ".next" "deploy_bundle\.next"
xcopy /E /I /Y "public" "deploy_bundle\public"
REM NOTE: NOT copying node_modules - Hostinger will npm install fresh
xcopy /E /I /Y "app" "deploy_bundle\app"
xcopy /E /I /Y "components" "deploy_bundle\components"
xcopy /E /I /Y "hooks" "deploy_bundle\hooks"
xcopy /E /I /Y "lib" "deploy_bundle\lib"
xcopy /E /I /Y "types" "deploy_bundle\types"
xcopy /E /I /Y "prisma" "deploy_bundle\prisma"

copy "server.js" "deploy_bundle\server.js"
copy "next.config.js" "deploy_bundle\next.config.js"
copy "tsconfig.json" "deploy_bundle\tsconfig.json"
copy "tailwind.config.ts" "deploy_bundle\tailwind.config.ts"
copy "postcss.config.js" "deploy_bundle\postcss.config.js"
copy "package.json" "deploy_bundle\package.json"
copy ".env.local" "deploy_bundle\.env.local" 2>nul || echo WARNING: .env.local not found

echo.
echo ====================================
echo Deployment Ready!
echo ====================================
echo.
echo Next steps for Hostinger:
echo.
echo 1. Go to cpanel/File Manager in Hostinger
echo 2. Navigate to where your Node app is (usually public_html or a subdomain folder)
echo 3. DELETE the old folder contents EXCEPT .env.local files
echo 4. Upload ALL contents of 'deploy_bundle' folder
echo 5. DO NOT UPLOAD node_modules - Hostinger will install it fresh
echo 6. In Hostinger terminal/SSH, run these commands:
echo    cd /your/app/path
echo    npm install
echo    npm start
echo.
echo Deploy folder location: deploy_bundle
echo Note: node_modules will be generated on Hostinger (faster, prevents corruption)
echo.
pause
