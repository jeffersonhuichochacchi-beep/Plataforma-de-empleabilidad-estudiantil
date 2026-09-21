# Pre-Deploy Verification Script for Render (PowerShell)

Write-Host "🔍 Pre-Deploy Verification Script for Render" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if required files exist
Write-Host "📁 Checking required files..." -ForegroundColor Yellow

$files = @(
    "pom.xml",
    "Dockerfile", 
    "render.yaml",
    "mvnw",
    "mvnw.cmd",
    "src\main\resources\application.properties"
)

$allFilesExist = $true

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file is missing" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

# Check Java version
Write-Host "☕ Checking Java version..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java not found or not in PATH" -ForegroundColor Red
}

Write-Host ""

# Check Maven
Write-Host "📦 Checking Maven wrapper..." -ForegroundColor Yellow
if (Test-Path "mvnw.cmd") {
    Write-Host "✓ Maven wrapper (mvnw.cmd) found" -ForegroundColor Green
} else {
    Write-Host "✗ Maven wrapper (mvnw.cmd) not found" -ForegroundColor Red
}

Write-Host ""

# Ask if user wants to test build
Write-Host "=============================================="
$testBuild = Read-Host "Do you want to test Maven build? (y/n)"

if ($testBuild -eq "y" -or $testBuild -eq "Y") {
    Write-Host "🔨 Running Maven build test..." -ForegroundColor Yellow
    Write-Host ""
    
    .\mvnw.cmd clean package -DskipTests
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Maven build successful" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✗ Maven build failed" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Pre-deploy check complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Commit and push your changes to GitHub"
Write-Host "2. Create a new Web Service on Render"
Write-Host "3. Follow the instructions in RENDER_DEPLOYMENT.md"
Write-Host ""
Write-Host "Quick reference: RENDER_QUICK_START.md" -ForegroundColor Cyan
