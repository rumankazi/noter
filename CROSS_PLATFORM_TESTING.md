# Cross-Platform E2E Testing

Test your Electron app across different operating systems from your Windows development machine using Docker.

## Quick Setup

```bash
# One-time setup
pnpm run setup:cross-platform
```

## Usage Examples

### Test All Platforms

```bash
# Test Windows (native) + Linux distributions (Docker)
pnpm run test:cross-platform
```

### Test Specific Platforms

```bash
# Test only Linux distributions
pnpm run test:cross-platform:linux

# Test specific Linux distros
pnpm run test:e2e:ubuntu
pnpm run test:e2e:fedora

# Test with options
pwsh scripts/test-cross-platform.ps1 -Platform ubuntu -Build -Cleanup
```

### Advanced Usage

```bash
# Force rebuild Docker images
pwsh scripts/test-cross-platform.ps1 -Platform all -Build

# Test and cleanup Docker resources
pwsh scripts/test-cross-platform.ps1 -Platform linux -Cleanup

# Get help
pwsh scripts/test-cross-platform.ps1 --help
```

## What Gets Tested

- **Windows**: Native E2E tests on your local machine
- **Ubuntu 22.04**: Containerized tests simulating Ubuntu environment
- **Fedora 39**: Containerized tests simulating Fedora environment

Each test verifies:

- Application startup and rendering
- Cross-platform window management
- Platform-specific UI behaviors
- Electron IPC communication
- All existing E2E test scenarios

## Benefits

✅ **Catch Linux-specific issues** before CI/CD  
✅ **Test multiple distros** (Ubuntu, Fedora, etc.)  
✅ **No VM overhead** - uses lightweight Docker containers  
✅ **Consistent environment** - same as production Linux systems  
✅ **Fast feedback** - run locally during development

## Files Structure

```
docker/
├── Dockerfile.ubuntu      # Ubuntu test environment
├── Dockerfile.fedora      # Fedora test environment
├── docker-compose.test.yml # Multi-container test setup
└── README.md             # Detailed Docker docs

scripts/
├── test-cross-platform.ps1 # PowerShell test runner
├── test-cross-platform.sh  # Bash test runner
└── setup-cross-platform-testing.ps1 # Setup script
```

## Troubleshooting

### Docker Issues

```bash
# Clean Docker resources
docker system prune -f
docker-compose -f docker/docker-compose.test.yml down --volumes
```

### Test Failures

- Check `test-results/` for detailed logs
- View `playwright-report/` for visual test reports
- Ensure Docker has enough memory allocated

### Permission Issues

```bash
# Fix test results ownership (Linux/macOS)
sudo chown -R $USER:$USER test-results playwright-report
```

## CI/CD Integration

The updated `.github/workflows/ci-cd.yml` now properly handles Linux E2E testing with headless display support.

For other CI systems, use:

```yaml
# Docker-based Linux testing
- run: docker-compose -f docker/docker-compose.test.yml run --rm test-ubuntu
```
