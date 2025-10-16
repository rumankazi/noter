# Cross-Platform Docker Testing

This directory contains Docker configurations for testing the Noter app across different Linux distributions on your Windows development machine.

## Prerequisites

- Docker Desktop installed and running
- PowerShell (for Windows scripts)

## Quick Start

### Run All Cross-Platform Tests

```bash
# PowerShell (recommended on Windows)
pnpm run test:cross-platform

# Or directly
pwsh scripts/test-cross-platform.ps1
```

### Run Specific Platform Tests

```bash
# Test only Linux distributions
pnpm run test:cross-platform:linux

# Test specific distributions
pnpm run test:e2e:ubuntu
pnpm run test:e2e:fedora

# Test with forced rebuild
pwsh scripts/test-cross-platform.ps1 -Platform ubuntu -Build
```

## Available Docker Images

### Ubuntu 22.04 (`test-ubuntu`)

- Based on Ubuntu 22.04 LTS
- Includes all necessary GUI libraries for Electron
- Uses Xvfb for headless display

### Fedora 39 (`test-fedora`)

- Based on Fedora 39
- Alternative RPM-based Linux distribution
- Different package management and library versions

## How It Works

1. **Docker Images**: Each Dockerfile creates a containerized Linux environment with:
   - Node.js 20.x
   - pnpm package manager
   - Playwright with dependencies
   - GUI libraries for Electron
   - Virtual display (Xvfb)

2. **Volume Mounting**: Test results and reports are mounted to your host machine:
   - `test-results/` - Playwright test results
   - `playwright-report/` - HTML test reports

3. **Headless Testing**: Uses Xvfb to create a virtual display for GUI applications

## Troubleshooting

### Docker Issues

```bash
# Clean up Docker resources
docker-compose -f docker/docker-compose.test.yml down --volumes
docker system prune -f

# Rebuild images
docker-compose -f docker/docker-compose.test.yml build --no-cache
```

### Permission Issues

If you encounter permission issues with test results:

```bash
# Fix ownership (run from project root)
sudo chown -R $USER:$USER test-results playwright-report
```

### Memory Issues

If Docker runs out of memory:

- Increase Docker Desktop memory allocation (Settings → Resources → Advanced)
- Run tests sequentially instead of in parallel

## CI/CD Integration

These Docker configurations can also be used in CI/CD pipelines:

```yaml
# Example GitHub Actions step
- name: Test Linux E2E
  run: |
    docker-compose -f docker/docker-compose.test.yml run --rm test-ubuntu
```

## Adding New Distributions

To add a new Linux distribution:

1. Create `docker/Dockerfile.{distro}`
2. Add service to `docker/docker-compose.test.yml`
3. Update test scripts in `scripts/`
4. Add npm script to `package.json`

Example for CentOS:

```dockerfile
FROM centos:8
# ... install dependencies
# ... setup Node.js and pnpm
# ... configure Electron environment
```
