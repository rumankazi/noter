# Docker Image Optimization

Our cross-platform testing setup uses optimized, minimal Docker images:

## Image Sizes & Resource Usage

| Platform   | Base Image          | Estimated Size | Memory Limit | CPU Limit |
| ---------- | ------------------- | -------------- | ------------ | --------- |
| Ubuntu     | ubuntu:22.04        | ~800MB         | 1GB          | 1 CPU     |
| Fedora     | fedora:39           | ~900MB         | 1GB          | 1 CPU     |
| macOS-like | alpine:3.18         | ~300MB         | 512MB        | 1 CPU     |
| Windows    | servercore:ltsc2022 | ~2GB           | 2GB          | 1 CPU     |

## Optimization Strategies

### 1. Minimal Base Images

- **Alpine Linux**: Used for macOS simulation (smallest footprint)
- **Ubuntu/Fedora**: Only essential packages installed
- **Windows Server Core**: Minimal Windows container

### 2. Layer Optimization

- Combined RUN commands to reduce layers
- Cleaned package caches (`apt-get clean`, `dnf clean all`)
- Removed unnecessary development tools

### 3. Multi-stage Builds (Future)

```dockerfile
# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM alpine:3.18
COPY --from=builder /app/node_modules ./node_modules
# ... rest of configuration
```

### 4. Resource Limits

```yaml
# docker-compose.test.yml
services:
  test-ubuntu:
    mem_limit: 1g # Limit memory usage
    cpus: 1 # Limit CPU cores
```

## Further Optimization Tips

### 1. Use .dockerignore

Ensure your `.dockerignore` excludes:

- `node_modules/`
- `dist/`
- `test-results/`
- `playwright-report/`
- `.git/`

### 2. Playwright Optimization for Electron

```bash
# Skip all browser downloads - Electron uses embedded Chromium
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# No need for playwright install since we're testing Electron, not browsers
# Electron provides its own Chromium runtime
```

### 3. Parallel Testing

```bash
# Run all platforms in parallel
docker-compose -f docker/docker-compose.test.yml up --abort-on-container-exit
```

### 4. Build Cache

```bash
# Use BuildKit for better caching
export DOCKER_BUILDKIT=1

# Build with cache from registry
docker build --cache-from myapp:latest .
```

## Resource Requirements

### Minimum System Requirements

- **RAM**: 8GB (4GB for Docker containers)
- **CPU**: 4 cores (2 for containers)
- **Disk**: 10GB free space

### Recommended System Requirements

- **RAM**: 16GB (8GB for Docker containers)
- **CPU**: 8 cores (4 for containers)
- **Disk**: 20GB free space
- **SSD**: For faster container startup

## Monitoring Resource Usage

```bash
# Monitor container resource usage
docker stats

# Check image sizes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Clean up unused resources
docker system prune -af
```

## CI/CD Optimization

```yaml
# GitHub Actions optimization
- name: Cache Docker layers
  uses: actions/cache@v3
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-
```
