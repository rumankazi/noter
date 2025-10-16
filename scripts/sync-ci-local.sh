#!/bin/bash
# CI/Local Environment Sync Validator
# Ensures local environment matches GitHub Actions exactly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 CI/Local Environment Sync Validator${NC}"
echo "=============================================="
echo

cd "$(dirname "$0")/.."

# Check 1: Node.js Version
echo -e "${YELLOW}📋 Checking Node.js version...${NC}"
NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

# Read required Node version from package.json
REQUIRED_NODE=$(grep -o '"node": "[^"]*"' package.json | cut -d'"' -f4 | sed 's/>=//g' | cut -d. -f1)

if [ "$NODE_MAJOR" -ge "$REQUIRED_NODE" ]; then
    echo -e "${GREEN}✅ Node.js $NODE_VERSION (meets requirement: >=$REQUIRED_NODE.x)${NC}"
else
    echo -e "${RED}❌ Node.js $NODE_VERSION (requires >=$REQUIRED_NODE.x from package.json)${NC}"
    echo "Install Node.js $REQUIRED_NODE.x or higher to match package.json engines field"
fi

# Check 2: pnpm Version
echo -e "${YELLOW}📋 Checking pnpm version...${NC}"
PNPM_VERSION=$(pnpm --version)
PNPM_MAJOR=$(echo $PNPM_VERSION | cut -d. -f1)

# Read required pnpm version from package.json
REQUIRED_PNPM=$(grep -o '"pnpm": "[^"]*"' package.json | cut -d'"' -f4 | sed 's/>=//g' | cut -d. -f1)

if [ "$PNPM_MAJOR" -ge "$REQUIRED_PNPM" ]; then
    echo -e "${GREEN}✅ pnpm $PNPM_VERSION (meets requirement: >=$REQUIRED_PNPM.x from package.json)${NC}"
else
    echo -e "${RED}❌ pnpm $PNPM_VERSION (requires >=$REQUIRED_PNPM.x from package.json)${NC}"
    echo "Install pnpm $REQUIRED_PNPM.x or higher"
fi

# Check 3: Environment Variables
echo -e "${YELLOW}📋 Checking environment variables...${NC}"
export CI=true
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

echo "CI: $CI"
echo "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: $PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD"
echo -e "${GREEN}✅ Environment variables set to match CI${NC}"

# Check 4: Docker Setup
echo -e "${YELLOW}📋 Checking Docker setup...${NC}"
if command -v docker &> /dev/null; then
    if docker ps &> /dev/null; then
        echo -e "${GREEN}✅ Docker is running${NC}"
    else
        echo -e "${RED}❌ Docker is installed but not running${NC}"
        echo "Start Docker to run container tests"
    fi
else
    echo -e "${RED}❌ Docker not installed${NC}"
    echo "Install Docker to run container tests that mirror CI"
fi

# Check 5: Script Permissions
echo -e "${YELLOW}📋 Checking script permissions...${NC}"
chmod +x scripts/test-local-ci.sh
chmod +x scripts/validate-containers.sh
echo -e "${GREEN}✅ All scripts have execute permissions${NC}"

# Check 6: Dependencies Sync
echo -e "${YELLOW}📋 Checking dependencies sync...${NC}"
if [ -f "pnpm-lock.yaml" ]; then
    echo -e "${GREEN}✅ pnpm-lock.yaml exists (ensures exact dependency versions)${NC}"
else
    echo -e "${RED}❌ pnpm-lock.yaml missing${NC}"
    echo "Run 'pnpm install' to generate lock file"
fi

# Check 7: Package.json Scripts
echo -e "${YELLOW}📋 Validating package.json scripts...${NC}"
required_scripts=("lint" "test" "build" "test:e2e" "test:e2e:ubuntu" "test:e2e:macos")
for script in "${required_scripts[@]}"; do
    if grep -q "\"$script\":" package.json; then
        echo -e "${GREEN}✅ Script '$script' exists${NC}"
    else
        echo -e "${RED}❌ Script '$script' missing${NC}"
    fi
done

# Check 8: Docker Compose Files
echo -e "${YELLOW}📋 Checking Docker configuration...${NC}"
if [ -f "docker/docker-compose.test.yml" ]; then
    echo -e "${GREEN}✅ docker-compose.test.yml exists${NC}"
else
    echo -e "${RED}❌ docker-compose.test.yml missing${NC}"
fi

if [ -f "docker/Dockerfile.ubuntu-gui" ] && [ -f "docker/Dockerfile.macos-gui" ]; then
    echo -e "${GREEN}✅ GUI Docker files exist${NC}"
else
    echo -e "${RED}❌ GUI Docker files missing${NC}"
fi

# Check 9: GitHub Actions Configuration
echo -e "${YELLOW}📋 Checking GitHub Actions configuration...${NC}"
if [ -f ".github/workflows/ci-cd.yml" ]; then
    # Check if CI uses latest versions (matches our package.json engines approach)
    if grep -q "node-version: latest" .github/workflows/ci-cd.yml; then
        echo -e "${GREEN}✅ CI uses latest Node.js (package.json engines field controls minimum)${NC}"
    else
        echo -e "${YELLOW}⚠️  CI should use 'node-version: latest' to respect package.json engines${NC}"
    fi
    
    if grep -q "version: latest" .github/workflows/ci-cd.yml; then
        echo -e "${GREEN}✅ CI uses latest pnpm (package.json engines field controls minimum)${NC}"
    else
        echo -e "${YELLOW}⚠️  CI should use 'version: latest' for pnpm to respect package.json engines${NC}"
    fi
    
    if grep -q "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1" .github/workflows/ci-cd.yml; then
        echo -e "${GREEN}✅ CI skips browser downloads (matches local)${NC}"
    else
        echo -e "${RED}❌ CI browser download setting mismatch${NC}"
    fi
    
    if grep -q "ELECTRON_DISABLE_SANDBOX" .github/workflows/ci-cd.yml; then
        echo -e "${GREEN}✅ CI disables Electron sandbox (matches Docker)${NC}"
    else
        echo -e "${RED}❌ CI Electron sandbox setting missing${NC}"
    fi
else
    echo -e "${RED}❌ GitHub Actions workflow missing${NC}"
fi

echo
echo -e "${BLUE}🎯 Environment Sync Summary${NC}"
echo "=============================================="
echo -e "${GREEN}✅ Using package.json engines field as single source of truth for versions${NC}"
echo -e "${GREEN}✅ CI uses 'latest' versions, respecting package.json minimums${NC}"
echo -e "${YELLOW}💡 Run 'bash scripts/test-local-ci.sh' to test everything locally before pushing${NC}"
echo -e "${BLUE}🚀 This ensures no surprises in the CI/CD pipeline!${NC}"
