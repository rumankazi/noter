#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌐 Cross-Platform Test Suite${NC}"
echo "============================="
echo

# Change to project directory
cd "$(dirname "$0")/.."

# Function to run platform tests
run_platform_test() {
    local platform=$1
    local service=$2
    local description=$3
    
    echo -e "${YELLOW}Testing $description...${NC}"
    echo "Platform: $platform"
    echo "Service: $service"
    echo
    
    if docker-compose -f docker/docker-compose.test.yml run --rm "$service"; then
        echo -e "${GREEN}✅ $description tests passed!${NC}"
        return 0
    else
        echo -e "${RED}❌ $description tests failed!${NC}"
        return 1
    fi
}

total_platforms=0
passed_platforms=0

echo -e "${BLUE}Running complete test suite on all platforms...${NC}"
echo

# Test Ubuntu Linux
echo -e "${BLUE}1. Ubuntu Linux Testing${NC}"
echo "-------------------------"
total_platforms=$((total_platforms + 1))
if run_platform_test "linux" "test-ubuntu" "Ubuntu Linux"; then
    passed_platforms=$((passed_platforms + 1))
fi
echo

# Test macOS-like (Ubuntu-based)
echo -e "${BLUE}2. macOS-like Testing${NC}"
echo "----------------------"
total_platforms=$((total_platforms + 1))
if run_platform_test "macos" "test-macos" "macOS-like (Ubuntu-based)"; then
    passed_platforms=$((passed_platforms + 1))
fi
echo

# Test Windows (if available)
echo -e "${BLUE}3. Windows Testing${NC}"
echo "-------------------"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Check if Docker is in Windows container mode
    if docker version --format '{{.Server.Os}}' 2>/dev/null | grep -q "windows"; then
        total_platforms=$((total_platforms + 1))
        if run_platform_test "windows" "test-windows" "Windows"; then
            passed_platforms=$((passed_platforms + 1))
        fi
    else
        echo -e "${YELLOW}⚠️  Skipping Windows container testing (Docker in Linux mode)${NC}"
        echo -e "${BLUE}💡 Switch to Windows containers in Docker Desktop to test Windows containers${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping Windows container testing (not on Windows host)${NC}"
fi
echo

# Summary
echo "============================="
echo -e "${BLUE}📊 Cross-Platform Test Summary${NC}"
echo
echo -e "Total platforms tested: $total_platforms"
echo -e "Successful platforms: ${GREEN}$passed_platforms${NC}"
echo -e "Failed platforms: ${RED}$((total_platforms - passed_platforms))${NC}"

if [ $passed_platforms -eq $total_platforms ]; then
    echo
    echo -e "${GREEN}🎉 All cross-platform tests passed!${NC}"
    echo
    echo -e "${BLUE}✨ Each platform ran complete test suite:${NC}"
    echo "   1. 📋 Lint checks (pnpm run lint)"
    echo "   2. 🔧 Unit tests (pnpm run test)"
    echo "   3. 🏗️  Build validation (pnpm run build)"
    echo "   4. 🧪 E2E tests (pnpm run test:e2e)"
    echo
    echo -e "${YELLOW}🎯 Cross-platform compatibility verified!${NC}"
    exit 0
else
    echo
    echo -e "${RED}❌ Some platform tests failed${NC}"
    echo -e "${YELLOW}💡 Check the logs above for details${NC}"
    exit 1
fi
