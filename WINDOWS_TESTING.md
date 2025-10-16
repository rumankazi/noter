# Windows Testing Guide

## Native Windows Testing (Recommended)

For Windows testing, the most reliable approach is to run tests natively on a Windows machine:

```bash
# On Windows (PowerShell or Command Prompt)
pnpm run build
pnpm run test:e2e
```

## Why Not Docker for Windows?

Windows containers have specific requirements:

- Require Windows Server host (not Linux)
- Large image sizes (~4GB+)
- Complex licensing considerations
- Limited headless GUI support

## Alternatives for Cross-Platform Development

### 1. GitHub Actions (Recommended)

Your CI/CD pipeline already tests Windows:

```yaml
# .github/workflows/ci-cd.yml already includes:
matrix:
  os: [windows-latest, macos-latest, ubuntu-latest]
```

### 2. Virtual Machines

- VirtualBox with Windows 10/11
- VMware with Windows Server
- Cloud VMs (Azure, AWS)

### 3. Wine (Linux/macOS)

Limited Electron support, not recommended for production testing.

## Testing Strategy

### Development (any OS)

```bash
# Test Linux variants locally
pnpm run test:e2e:ubuntu
pnpm run test:e2e:macos

# Simulate cross-platform behavior
pnpm run test:cross-platform:linux
```

### CI/CD Pipeline

- Windows: Native GitHub Actions runner
- Linux: Docker containers or native runners
- macOS: Native GitHub Actions runner

## Windows-Specific Issues to Test

1. **File Paths**: Backslash vs forward slash
2. **Case Sensitivity**: Windows is case-insensitive
3. **Line Endings**: CRLF vs LF
4. **Permissions**: Different user/admin model
5. **Window Management**: Windows-specific APIs

## Local Windows Development

If developing on Windows:

```bash
# Use native testing
pnpm run test:e2e

# Test other platforms with Docker
pnpm run test:e2e:ubuntu
pnpm run test:e2e:macos
```

If developing on Mac/Linux:

```bash
# Test Unix-like systems locally
pnpm run test:cross-platform:linux

# Rely on CI for Windows validation
git push  # Triggers Windows tests in GitHub Actions
```
