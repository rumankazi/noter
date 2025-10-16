#!/bin/bash
# Comprehensive local testing script that mirrors CI/CD pipeline exactly
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
declare -A test_results
total_tests=0
passed_tests=0

log_test_result() {
    local test_name="$1"
    local status="$2"
    test_results["$test_name"]="$status"
    total_tests=$((total_tests + 1))
    if [ "$status" = "PASSED" ]; then
        passed_tests=$((passed_tests + 1))
        echo -e "${GREEN}✅ $test_name: PASSED${NC}"
    else
        echo -e "${RED}❌ $test_name: FAILED${NC}"
    fi
}

echo -e "${BLUE}🧪 Complete Local CI/CD Pipeline Test${NC}"
echo "==========================================="
echo "This script runs ALL tests exactly as they would run in GitHub Actions"
echo

# Change to project directory
cd "$(dirname "$0")/.."

# Set CI environment variables to match GitHub Actions
export CI=true
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

echo -e "${YELLOW}📋 Environment Setup${NC}"
echo "CI: $CI"
echo "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: $PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD"
echo "Node version: $(node --version)"
echo "pnpm version: $(pnpm --version)"
echo

# Test 1: Dependencies and Linting
echo -e "${BLUE}1. Dependencies and Code Quality${NC}"
echo "Installing dependencies..."
if pnpm install --frozen-lockfile > /tmp/install.log 2>&1; then
    log_test_result "Dependencies Install" "PASSED"
else
    log_test_result "Dependencies Install" "FAILED"
    echo "Check /tmp/install.log for details"
fi

echo "Running linter..."
if pnpm run lint > /tmp/lint.log 2>&1; then
    log_test_result "Linting" "PASSED"
else
    log_test_result "Linting" "FAILED"
    echo "Check /tmp/lint.log for details"
fi

echo

# Test 2: Unit Tests
echo -e "${BLUE}2. Unit Tests${NC}"
if pnpm run test > /tmp/unit.log 2>&1; then
    log_test_result "Unit Tests" "PASSED"
else
    log_test_result "Unit Tests" "FAILED"
    echo "Check /tmp/unit.log for details"
fi

echo

# Test 3: Build
echo -e "${BLUE}3. Application Build${NC}"
if pnpm run build > /tmp/build.log 2>&1; then
    log_test_result "Build" "PASSED"
else
    log_test_result "Build" "FAILED"
    echo "Check /tmp/build.log for details"
fi

echo

# Test 4: Native E2E Tests
echo -e "${BLUE}4. Native E2E Tests (Windows)${NC}"
if pnpm run test:e2e > /tmp/e2e-native.log 2>&1; then
    log_test_result "Native E2E Tests" "PASSED"
else
    log_test_result "Native E2E Tests" "FAILED"
    echo "Check /tmp/e2e-native.log for details"
fi

echo

# Test 5: Docker Ubuntu E2E Tests
echo -e "${BLUE}5. Docker Ubuntu E2E Tests${NC}"
echo "Building Ubuntu container..."
if docker-compose -f docker/docker-compose.test.yml build test-ubuntu > /tmp/docker-ubuntu-build.log 2>&1; then
    echo "Running Ubuntu container tests..."
    if timeout 300 pnpm run test:e2e:ubuntu > /tmp/e2e-ubuntu.log 2>&1; then
        log_test_result "Docker Ubuntu E2E" "PASSED"
    else
        log_test_result "Docker Ubuntu E2E" "FAILED"
        echo "Check /tmp/e2e-ubuntu.log for details"
    fi
else
    log_test_result "Docker Ubuntu E2E" "FAILED"
    echo "Docker build failed. Check /tmp/docker-ubuntu-build.log for details"
fi

echo

# Test 6: Docker macOS E2E Tests  
echo -e "${BLUE}6. Docker macOS E2E Tests${NC}"
echo "Building macOS container..."
if docker-compose -f docker/docker-compose.test.yml build test-macos > /tmp/docker-macos-build.log 2>&1; then
    echo "Running macOS container tests..."
    if timeout 300 pnpm run test:e2e:macos > /tmp/e2e-macos.log 2>&1; then
        log_test_result "Docker macOS E2E" "PASSED"
    else
        log_test_result "Docker macOS E2E" "FAILED"
        echo "Check /tmp/e2e-macos.log for details"
    fi
else
    log_test_result "Docker macOS E2E" "FAILED"
    echo "Docker build failed. Check /tmp/docker-macos-build.log for details"
fi

echo

# Test 7: Docker windows E2E Tests
echo -e "${BLUE}7. Docker Windows E2E Tests${NC}"
echo "Setting up Windows CI simulation container..."
if docker-compose -f docker/docker-compose.test.yml build test-windows > /tmp/docker-windows-build.log 2>&1; then
    echo "Running Windows container tests..."
    if timeout 300 pnpm run test:e2e:windows > /tmp/e2e-windows.log 2>&1; then
        log_test_result "Docker Windows E2E" "PASSED"
    else
        log_test_result "Docker Windows E2E" "FAILED"
        echo "Check /tmp/e2e-windows.log for details"
    fi
else
    log_test_result "Docker Windows E2E" "FAILED"
    echo "Docker build failed. Check /tmp/docker-windows-build.log for details"
fi


# Test 8: Container Validation (Build/Unit/Lint)
echo -e "${BLUE}8. Container Validation${NC}"
if bash scripts/validate-containers.sh > /tmp/container-validation.log 2>&1; then
    log_test_result "Container Validation" "PASSED"
else
    log_test_result "Container Validation" "FAILED"
    echo "Check /tmp/container-validation.log for details"
fi

echo

# Summary
echo "==========================================="
echo -e "${BLUE}📊 Complete Test Summary${NC}"
echo
echo -e "Total tests: $total_tests"
echo -e "Passed: ${GREEN}$passed_tests${NC}"
echo -e "Failed: ${RED}$((total_tests - passed_tests))${NC}"
echo

echo -e "${YELLOW}📋 Individual Results:${NC}"
for test_name in "${!test_results[@]}"; do
    status="${test_results[$test_name]}"
    if [ "$status" = "PASSED" ]; then
        echo -e "  ${GREEN}✅${NC} $test_name"
    else
        echo -e "  ${RED}❌${NC} $test_name"
    fi
done

echo

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 All tests passed! Ready for CI/CD pipeline! 🚀${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Fix issues before pushing to CI/CD.${NC}"
    echo
    echo -e "${YELLOW}💡 Log files created in /tmp/:${NC}"
    echo "  - install.log, lint.log, unit.log, build.log"
    echo "  - e2e-native.log, e2e-ubuntu.log, e2e-macos.log"
    echo "  - docker-ubuntu-build.log, docker-macos-build.log"
    echo "  - container-validation.log"
    exit 1
fi
