#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Container Validation Suite${NC}"
echo "=================================="
echo

# Function to run validation in container
validate_container() {
    local name=$1
    local image=$2
    
    echo -e "${YELLOW}Testing $name container...${NC}"
    
    # Test 1: Basic build validation
    echo "  ✓ Building dependencies..."
    if docker run --rm "$image" pnpm run build > /dev/null 2>&1; then
        echo -e "    ${GREEN}✓ Build successful${NC}"
    else
        echo -e "    ${RED}✗ Build failed${NC}"
        return 1
    fi
    
    # Test 2: Unit tests
    echo "  ✓ Running unit tests..."
    if docker run --rm "$image" pnpm test > /dev/null 2>&1; then
        echo -e "    ${GREEN}✓ Unit tests passed${NC}"
    else
        echo -e "    ${RED}✗ Unit tests failed${NC}"
        return 1
    fi
    
    # Test 3: TypeScript validation
    echo "  ✓ TypeScript compilation..."
    if docker run --rm "$image" pnpm run build:main > /dev/null 2>&1; then
        echo -e "    ${GREEN}✓ TypeScript validation passed${NC}"
    else
        echo -e "    ${RED}✗ TypeScript validation failed${NC}"
        return 1
    fi
    
    # Test 4: Linting
    echo "  ✓ Code linting..."
    if docker run --rm "$image" pnpm run lint > /dev/null 2>&1; then
        echo -e "    ${GREEN}✓ Linting passed${NC}"
    else
        echo -e "    ${RED}✗ Linting failed${NC}"
        return 1
    fi
    
    echo -e "  ${GREEN}✓ $name container validation complete${NC}"
    echo
    return 0
}

# Change to project directory
cd "$(dirname "$0")/.."

total_tests=0
passed_tests=0

# Test Ubuntu container
echo -e "${BLUE}1. Ubuntu 22.04 Container${NC}"
total_tests=$((total_tests + 1))
if validate_container "Ubuntu" "docker-test-ubuntu:latest"; then
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}Ubuntu container validation failed${NC}"
fi

# Test macOS-like (Ubuntu-based) container
echo -e "${BLUE}2. macOS-like (Ubuntu-based) Container${NC}"
total_tests=$((total_tests + 1))
if validate_container "macOS-like" "docker-test-macos:latest"; then
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}macOS-like container validation failed${NC}"
fi

# Summary
echo "=================================="
echo -e "${BLUE}📊 Validation Summary${NC}"
echo
echo -e "Total containers tested: $total_tests"
echo -e "Successful validations: ${GREEN}$passed_tests${NC}"
echo -e "Failed validations: ${RED}$((total_tests - passed_tests))${NC}"

if [ $passed_tests -eq $total_tests ]; then
    echo
    echo -e "${GREEN}🎉 All container validations passed!${NC}"
    echo -e "${YELLOW}Note: E2E tests require GUI support and should run on native systems${NC}"
    exit 0
else
    echo
    echo -e "${RED}❌ Some container validations failed${NC}"
    exit 1
fi
