#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Local Packaging Test${NC}"
echo "======================="
echo

cd "$(dirname "$0")/.."

# Function to test packaging
test_packaging() {
    local platform="$1"
    local command="$2"
    
    echo -e "${YELLOW}Testing $platform packaging...${NC}"
    echo "Command: $command"
    echo "----------------------------------------"
    
    # Clean previous builds
    if [ -d "release" ]; then
        echo "Cleaning previous release..."
        rm -rf release
    fi
    
    # Build first
    echo "Building application..."
    if ! pnpm run build; then
        echo -e "${RED}❌ Build failed${NC}"
        return 1
    fi
    
    # Package
    echo "Packaging for $platform..."
    
    # Set environment variables for packaging (disable code signing)
    unset WIN_CSC_LINK 2>/dev/null || true
    unset CSC_LINK 2>/dev/null || true
    export CSC_IDENTITY_AUTO_DISCOVERY=false
    export WIN_CSC_LINK=""
    export CSC_KEY_PASSWORD=""
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $platform packaging successful${NC}"
        
        # List generated files
        if [ -d "release" ]; then
            echo "Generated files:"
            ls -la release/
        fi
        return 0
    else
        echo -e "${RED}❌ $platform packaging failed${NC}"
        return 1
    fi
}

echo -e "${BLUE}Environment Information:${NC}"
echo "OS: $(uname -s 2>/dev/null || echo 'Windows')"
echo "Node: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "electron-builder: $(pnpm list electron-builder --depth=0 2>/dev/null | grep electron-builder || echo 'Not found')"
echo

# Detect platform and test appropriate packaging
case "$(uname -s 2>/dev/null || echo 'Windows')" in
    Linux*)
        echo -e "${BLUE}🐧 Testing Linux packaging...${NC}"
        if test_packaging "Linux" "pnpm run dist:linux"; then
            echo -e "${GREEN}🎉 Linux packaging works!${NC}"
        else
            echo -e "${RED}💥 Linux packaging failed${NC}"
            echo -e "${YELLOW}💡 This might be the same issue as in CI${NC}"
        fi
        ;;
    Darwin*)
        echo -e "${BLUE}🍎 Testing macOS packaging...${NC}"
        if test_packaging "macOS" "pnpm run dist:mac"; then
            echo -e "${GREEN}🎉 macOS packaging works!${NC}"
        else
            echo -e "${RED}💥 macOS packaging failed${NC}"
        fi
        ;;
    CYGWIN*|MINGW*|MSYS*)
        echo -e "${BLUE}🪟 Testing Windows packaging...${NC}"
        echo -e "${YELLOW}⚠️  Note: Windows packaging requires Administrator privileges for symbolic links${NC}"
        echo -e "${BLUE}💡 Trying directory-only packaging to avoid code signing issues...${NC}"
        if test_packaging "Windows (dir)" "pnpm run pack"; then
            echo -e "${GREEN}🎉 Windows directory packaging works!${NC}"
            echo -e "${YELLOW}💡 For full Windows installer, run as Administrator or disable code signing${NC}"
        else
            echo -e "${RED}💥 Windows packaging failed${NC}"
            echo -e "${YELLOW}🔧 Common Windows packaging issues:${NC}"
            echo "   1. Run terminal as Administrator for symbolic link support"
            echo "   2. Clear electron-builder cache: npx electron-builder install-app-deps"
            echo "   3. Disable code signing in package.json for testing"
        fi
        ;;
    *)
        echo -e "${YELLOW}⚠️  Unknown platform, testing generic packaging...${NC}"
        if test_packaging "Generic" "pnpm run pack"; then
            echo -e "${GREEN}🎉 Generic packaging works!${NC}"
        else
            echo -e "${RED}💥 Generic packaging failed${NC}"
        fi
        ;;
esac

echo
echo -e "${BLUE}🔍 Debugging Information:${NC}"
echo "========================="
echo "If packaging failed, check:"
echo "1. All dependencies are installed: pnpm install"
echo "2. Application builds successfully: pnpm run build"
echo "3. electron-builder configuration in package.json"
echo "4. Missing metadata for FPM (Linux) packaging"
echo
echo -e "${YELLOW}For Windows packaging issues specifically:${NC}"
echo "- Run terminal as Administrator (for symbolic link support)"
echo "- Clear cache: pnpm run clean:cache"
echo "- Try directory packaging: pnpm run pack"
echo "- Check Windows Defender/Antivirus interference"
echo
echo -e "${YELLOW}For Linux packaging issues specifically:${NC}"
echo "- Check if 'description', 'maintainer', 'vendor' are set"
echo "- Verify 'category' is a valid desktop category"
echo "- Ensure 'desktop' entry has proper fields"
echo
echo -e "${GREEN}🚀 Quick fixes to try:${NC}"
echo "1. pnpm run clean:cache"
echo "2. pnpm install --frozen-lockfile"
echo "3. pnpm run build"
echo "4. pnpm run pack (for directory-only packaging)"
