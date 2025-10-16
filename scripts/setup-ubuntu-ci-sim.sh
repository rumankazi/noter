#!/bin/bash
# Ubuntu CI Environment Simulator for Windows
# Simulates the exact Ubuntu setup used in GitHub Actions

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐧 Ubuntu CI Environment Simulator${NC}"
echo "=============================================="
echo "Simulating the exact Ubuntu setup from GitHub Actions"
echo

cd "$(dirname "$0")/.."

# Create a Docker container that exactly matches GitHub Actions Ubuntu
echo -e "${YELLOW}📋 Creating Ubuntu CI simulation container...${NC}"

cat > docker/Dockerfile.ubuntu-ci-sim << 'EOF'
# Exact simulation of GitHub Actions Ubuntu environment
FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install the exact same packages as GitHub Actions Ubuntu setup
RUN apt-get update && apt-get install -y \
    curl \
    git \
    sudo \
    # GUI dependencies that match our CI enhancement
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
    libasound2 \
    libnss3 \
    dbus-x11 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Install Node.js 20.x (exact version used in CI)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install pnpm latest (matches CI)
RUN npm install -g pnpm@latest

# Create user with sudo access (simulates GitHub Actions runner)
RUN useradd -ms /bin/bash runner && \
    echo 'runner ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Set working directory
WORKDIR /home/runner/work

# Switch to runner user
USER runner

# Set environment variables to match CI
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV DISPLAY=:99
ENV ELECTRON_DISABLE_SANDBOX=1

# Copy project files
COPY --chown=runner:runner . ./noter/

# Install dependencies
WORKDIR /home/runner/work/noter
RUN pnpm install --frozen-lockfile

# Default command
CMD ["/bin/bash"]
EOF

# Build the simulation container
echo -e "${YELLOW}📋 Building Ubuntu CI simulation...${NC}"
if docker build -f docker/Dockerfile.ubuntu-ci-sim -t noter-ubuntu-ci-sim . > /tmp/ubuntu-ci-sim-build.log 2>&1; then
    echo -e "${GREEN}✅ Ubuntu CI simulation container built${NC}"
else
    echo -e "${RED}❌ Failed to build simulation container${NC}"
    echo "Check /tmp/ubuntu-ci-sim-build.log for details"
    exit 1
fi

# Create test script for the simulation
cat > docker/test-ubuntu-ci-sim.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Running CI simulation tests..."

# Start virtual display (exact command from CI)
echo "Starting virtual display..."
sudo Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset > /dev/null 2>&1 &
sleep 3

# Run the exact same test sequence as CI
echo "Running linter..."
pnpm run lint

echo "Running unit tests..."
pnpm run test

echo "Building application..."
pnpm run build

echo "Running E2E tests..."
pnpm run test:e2e

echo "🎉 All CI simulation tests completed!"
EOF

chmod +x docker/test-ubuntu-ci-sim.sh

# Add to docker-compose for easy management
cat >> docker/docker-compose.test.yml << 'EOF'

  # Ubuntu CI Environment Simulation
  ubuntu-ci-sim:
    build:
      context: ..
      dockerfile: docker/Dockerfile.ubuntu-ci-sim
    volumes:
      - ../test-results:/home/runner/work/noter/test-results
      - ../playwright-report:/home/runner/work/noter/playwright-report
    environment:
      - CI=true
      - PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
      - DISPLAY=:99
      - ELECTRON_DISABLE_SANDBOX=1
    command: bash docker/test-ubuntu-ci-sim.sh
EOF

echo -e "${GREEN}✅ Ubuntu CI simulation ready!${NC}"
echo
echo -e "${YELLOW}📋 To test Ubuntu CI environment locally:${NC}"
echo "docker-compose -f docker/docker-compose.test.yml run --rm ubuntu-ci-sim"
echo
echo -e "${YELLOW}📋 To debug interactively:${NC}"
echo "docker run -it --rm noter-ubuntu-ci-sim bash"
echo
echo -e "${BLUE}🎯 This simulation matches GitHub Actions Ubuntu environment exactly!${NC}"
