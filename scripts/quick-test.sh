#!/bin/bash
# Quick test script for cross-platform setup

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Quick Cross-Platform Test Suite${NC}"
echo -e "${BLUE}=====================================${NC}"

cd "$(dirname "$0")/.."

# Step 1: Native Environment Tests
echo -e "\n${BLUE}1. Native Environment Tests${NC}"
echo "Running native tests to ensure baseline functionality..."

if pnpm run build && pnpm run test:unit; then
    echo -e "${GREEN}✅ Native tests passed${NC}"
else
    echo -e "${RED}❌ Native tests failed${NC}"
    exit 1
fi

# Step 2: Cross-Platform Container Validation
echo -e "\n${BLUE}2. Cross-Platform Container Validation${NC}"
echo "Running focused container validation (build, unit tests, linting)..."

if bash scripts/validate-containers.sh; then
    echo -e "${GREEN}✅ All container validations passed${NC}"
else
    echo -e "${RED}❌ Container validation failed${NC}"
    exit 1
fi

# Summary
echo -e "\n${GREEN}🎉 Quick Cross-Platform Test Summary${NC}"
echo -e "${GREEN}====================================${NC}"
echo -e "✅ Native tests: PASSED"
echo -e "✅ Ubuntu container: Build, unit tests, TypeScript, linting all PASSED"
echo -e "✅ Alpine container: Build, unit tests, TypeScript, linting all PASSED"

echo -e "\n${BLUE}💡 Key Insights:${NC}"
echo "  • Code builds successfully across Ubuntu and macOS-like environments"
echo "  • Unit tests work consistently cross-platform"  
echo "  • TypeScript compilation validated on all platforms"
echo "  • Code style/linting consistent across environments"

echo -e "\n${YELLOW}📋 For E2E Testing:${NC}"
echo "  pnpm run test:e2e                     # Native E2E tests"
echo "  # Container E2E tests require GUI - use GitHub Actions instead"
echo "  # This validation ensures CI/CD pipeline compatibility"
