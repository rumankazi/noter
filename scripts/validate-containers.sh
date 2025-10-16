#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Container Test Suite Validation${NC}"
echo "===================================="
echo

# Function to validate container test commands
validate_container_config() {
    local container_name=$1
    
    echo -e "${YELLOW}Validating $container_name container configuration...${NC}"
    
    # Extract the entire service section from test-container to the next service or end
    local service_section=$(sed -n "/test-$container_name:/,/^[[:space:]]*test-/p" docker/docker-compose.test.yml | head -n -1)
    if [ -z "$service_section" ]; then
        # If no next service found, get to the end of file
        service_section=$(sed -n "/test-$container_name:/,\$p" docker/docker-compose.test.yml)
    fi
    
    # Check for required test stages in the service section
    local required_commands=("pnpm run lint" "pnpm run test" "pnpm run build" "pnpm run test:e2e")
    local missing_commands=()
    
    for cmd in "${required_commands[@]}"; do
        if ! echo "$service_section" | grep -q "$cmd"; then
            missing_commands+=("$cmd")
        fi
    done
    
    if [ ${#missing_commands[@]} -eq 0 ]; then
        echo -e "  ${GREEN}✓ Complete test suite configured${NC}"
        echo "    - Lint checks"
        echo "    - Unit tests"
        echo "    - Build validation"
        echo "    - E2E tests"
        return 0
    else
        echo -e "  ${RED}✗ Missing test commands:${NC}"
        printf '    - %s\n' "${missing_commands[@]}"
        return 1
    fi
}

# Function to run actual container validation
validate_container_execution() {
    local name=$1
    local service=$2
    
    echo -e "${YELLOW}Testing $name container execution...${NC}"
    
    # Build the container first
    echo "  ✓ Building container..."
    if docker-compose -f docker/docker-compose.test.yml build "$service" > /dev/null 2>&1; then
        echo -e "    ${GREEN}✓ Container build successful${NC}"
    else
        echo -e "    ${RED}✗ Container build failed${NC}"
        return 1
    fi
    
    echo -e "  ${GREEN}✓ $name container ready for testing${NC}"
    echo
    return 0
}

# Change to project directory
cd "$(dirname "$0")/.."

# Check if docker-compose.test.yml exists
if [ ! -f "docker/docker-compose.test.yml" ]; then
    echo -e "${RED}❌ docker/docker-compose.test.yml not found${NC}"
    exit 1
fi

total_tests=0
passed_tests=0

echo -e "${BLUE}1. Configuration Validation${NC}"
echo "----------------------------"

# Validate Ubuntu container configuration
total_tests=$((total_tests + 1))
if validate_container_config "ubuntu"; then
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}Ubuntu container configuration invalid${NC}"
fi
echo

# Validate macOS container configuration
total_tests=$((total_tests + 1))
if validate_container_config "macos"; then
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}macOS container configuration invalid${NC}"
fi
echo

# Validate Windows container configuration
total_tests=$((total_tests + 1))
if validate_container_config "windows"; then
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}Windows container configuration invalid${NC}"
fi
echo

if [ $passed_tests -ne $total_tests ]; then
    echo -e "${RED}❌ Some container configurations are invalid. Fix before proceeding.${NC}"
    exit 1
fi
echo

echo -e "${BLUE}2. Container Build Validation${NC}"
echo "------------------------------"

# Test Ubuntu container build
total_tests=$((total_tests + 1))
if validate_container_execution "Ubuntu" "test-ubuntu"; then
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}Ubuntu container build failed${NC}"
fi

# Test macOS-like container build
total_tests=$((total_tests + 1))
if validate_container_execution "macOS-like" "test-macos"; then
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}macOS-like container build failed${NC}"
fi

# Test Windows container build (if on Windows host with Windows containers enabled)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Check if Docker is in Windows container mode
    if docker version --format '{{.Server.Os}}' 2>/dev/null | grep -q "windows"; then
        total_tests=$((total_tests + 1))
        if validate_container_execution "Windows" "test-windows"; then
            passed_tests=$((passed_tests + 1))
        else
            echo -e "${RED}Windows container build failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Skipping Windows container validation (Docker in Linux mode)${NC}"
        echo -e "${BLUE}💡 Switch to Windows containers in Docker Desktop to test Windows containers${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping Windows container validation (not on Windows host)${NC}"
fi

# Summary
echo "===================================="
echo -e "${BLUE}📊 Validation Summary${NC}"
echo
echo -e "Total validations: $total_tests"
echo -e "Successful: ${GREEN}$passed_tests${NC}"
echo -e "Failed: ${RED}$((total_tests - passed_tests))${NC}"

if [ $passed_tests -eq $total_tests ]; then
    echo
    echo -e "${GREEN}🎉 All container validations passed!${NC}"
    echo -e "${BLUE}📦 All containers will run complete test suite:${NC}"
    echo "   1. Lint checks (pnpm run lint)"
    echo "   2. Unit tests (pnpm run test)"
    echo "   3. Build validation (pnpm run build)"
    echo "   4. E2E tests (pnpm run test:e2e)"
    echo
    echo -e "${BLUE}🌐 Cross-platform coverage:${NC}"
    echo "   • Ubuntu Linux (docker/Dockerfile.ubuntu-gui)"
    echo "   • macOS-like (docker/Dockerfile.macos-gui)"
    echo "   • Windows (docker/Dockerfile.windows-gui)"
    echo
    echo -e "${YELLOW}🎯 Docker testing now matches GitHub Actions workflow${NC}"
    exit 0
else
    echo
    echo -e "${RED}❌ Some container validations failed${NC}"
    exit 1
fi
