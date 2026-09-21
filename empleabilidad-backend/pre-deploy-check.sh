#!/bin/bash

echo "🔍 Pre-Deploy Verification Script for Render"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required files exist
echo "📁 Checking required files..."

files=("pom.xml" "Dockerfile" "render.yaml" "mvnw" "src/main/resources/application.properties")
all_files_exist=true

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file is missing"
        all_files_exist=false
    fi
done

echo ""

# Check if mvnw is executable
if [ -x "mvnw" ]; then
    echo -e "${GREEN}✓${NC} mvnw has execute permissions"
else
    echo -e "${YELLOW}⚠${NC} mvnw is not executable - fixing..."
    chmod +x mvnw
    echo -e "${GREEN}✓${NC} Execute permissions added to mvnw"
fi

echo ""

# Check Java version
echo "☕ Checking Java version..."
if command -v java &> /dev/null; then
    java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    echo -e "${GREEN}✓${NC} Java version: $java_version"
else
    echo -e "${RED}✗${NC} Java not found"
fi

echo ""

# Test Maven build (optional, can be slow)
read -p "Do you want to test Maven build? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Running Maven build test..."
    ./mvnw clean package -DskipTests
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Maven build successful"
    else
        echo -e "${RED}✗${NC} Maven build failed"
    fi
fi

echo ""
echo "=============================================="
echo "✅ Pre-deploy check complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push your changes to GitHub"
echo "2. Create a new Web Service on Render"
echo "3. Follow the instructions in RENDER_DEPLOYMENT.md"
echo ""
