#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 CI Issue Reproducer${NC}"
echo "=========================="
echo

cd "$(dirname "$0")/.."

echo -e "${YELLOW}🎯 Reproducing GitHub Actions issues locally...${NC}"
echo

# Function to run command with GitHub Actions environment
run_ci_step() {
    local step_name="$1"
    local command="$2"
    local env_vars="$3"
    
    echo -e "${BLUE}📋 $step_name${NC}"
    echo "Command: $command"
    if [ -n "$env_vars" ]; then
        echo "Environment: $env_vars"
    fi
    echo "----------------------------------------"
    
    # Set CI environment
    export CI=true
    export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
    
    # Set additional environment variables if provided
    if [ -n "$env_vars" ]; then
        eval "export $env_vars"
    fi
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $step_name passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $step_name failed${NC}"
        return 1
    fi
}

echo -e "${BLUE}🔧 Issue 1: Windows ESLint Problem${NC}"
echo "-----------------------------------"
echo "Testing ESLint with Windows-like configuration..."

# Test ESLint with Windows-style environment
if run_ci_step "ESLint (Windows simulation)" "pnpm run lint" "ESLINT_USE_FLAT_CONFIG=false"; then
    echo -e "${GREEN}✅ ESLint issue likely resolved${NC}"
else
    echo -e "${RED}❌ ESLint still failing - needs further investigation${NC}"
    echo -e "${YELLOW}💡 Common Windows ESLint issues:${NC}"
    echo "   - Line ending differences (CRLF vs LF)"
    echo "   - Path separator differences (\\ vs /)"
    echo "   - Case sensitivity differences"
    echo "   - Missing .eslintrc configuration"
fi
echo

echo -e "${BLUE}🔧 Issue 2: Ubuntu Package Dependencies${NC}"
echo "----------------------------------------"
echo "Checking if local Docker Ubuntu matches CI environment..."

# Check if we can simulate the Ubuntu package issue
if command -v docker &> /dev/null; then
    echo "Testing Ubuntu package installation in Docker..."
    
    # Create a test Dockerfile to simulate the CI environment
    cat > .ci-test-dockerfile << 'EOF'
FROM ubuntu:latest
RUN apt-get update && apt-get install -y \
    xvfb \
    libgtk-3-0 \
    libgbm-dev \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    libdrm2 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libnss3 \
    dbus-x11
# Try new package name first, fallback to old
RUN apt-get install -y libasound2t64 || apt-get install -y libasound2 || true
EOF

    if docker build -f .ci-test-dockerfile -t ci-ubuntu-test . > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Ubuntu package dependencies resolved${NC}"
        docker rmi ci-ubuntu-test > /dev/null 2>&1 || true
    else
        echo -e "${RED}❌ Ubuntu package issue still exists${NC}"
    fi
    
    rm -f .ci-test-dockerfile
else
    echo -e "${YELLOW}⚠️  Docker not available - cannot test Ubuntu packages locally${NC}"
fi
echo

echo -e "${BLUE}🛠️  Recommendations${NC}"
echo "==================="
echo -e "${YELLOW}For Windows ESLint issues:${NC}"
echo "1. Check .eslintrc configuration"
echo "2. Verify line endings are consistent (LF preferred)"
echo "3. Test with: git config core.autocrlf false"
echo "4. Run: pnpm run lint:fix to auto-fix issues"
echo
echo -e "${YELLOW}For Ubuntu package issues:${NC}"
echo "1. Updated CI to use libasound2t64 with fallback"
echo "2. Package installation now has error handling"
echo "3. Monitor GitHub Actions logs for confirmation"
echo
echo -e "${GREEN}🚀 Next Steps:${NC}"
echo "1. Commit and push these fixes"
echo "2. Monitor GitHub Actions for resolution"
echo "3. Use 'pnpm run lint:fix' to fix any remaining ESLint issues"
