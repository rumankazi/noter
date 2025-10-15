# GitHub Actions Workflow Guide

This document explains the optimized GitHub Actions workflow for the Noter application, designed to efficiently handle both Pull Request validation and main branch releases.

## Workflow Overview

### 🔄 Pull Request Workflow (`.github/workflows/build.yml`)

When a PR is opened or updated, the following jobs run:

1. **Test Suite** (`test`)
   - Runs on macOS (closest to development environment)
   - Linting with ESLint
   - Unit tests with Vitest
   - Build validation
   - E2E tests with Playwright

2. **PR Build Validation** (`pr-build`) 
   - Runs only for PRs
   - Quick validation build (Linux only for speed)
   - Verifies packaging works without creating release artifacts
   - Provides clear feedback that full builds happen on merge

### 🚀 Main Branch Workflow (`.github/workflows/build.yml`)

When code is merged to `main`, the following jobs run:

1. **Test Suite** (`test`)
   - Same comprehensive testing as PRs

2. **Build Release Artifacts** (`build`)
   - Multi-platform matrix build (Windows, macOS, Linux)
   - Creates all distribution formats (.exe, .msi, .dmg, .zip, .AppImage, .deb, .rpm)
   - Uploads artifacts with 30-day retention
   - Includes icon generation

3. **Create Release** (`release`)
   - Downloads all platform artifacts
   - Runs semantic-release for version management
   - Creates GitHub releases with proper changelog
   - Uploads all platform binaries to the release

### 📋 PR Status Workflow (`.github/workflows/pr-status.yml`)

Provides clear communication about what happens in PRs vs main branch merges.

## Key Features

### ✅ Optimized for Speed
- **PR builds**: Only test + single Linux build (~5-10 minutes)
- **Main builds**: Full multi-platform (~15-20 minutes)
- **Parallel execution**: Test and build jobs run simultaneously where possible

### ✅ Clear Communication
- PR status comments explain what validations run
- Build summaries show progress and results
- Different job names for PR vs release builds

### ✅ Resource Efficiency
- PR artifacts not stored (just validation)
- Main branch artifacts stored for 30 days
- Proper caching of dependencies

### ✅ Robust Testing
- Unit tests with Vitest
- E2E tests with Playwright
- Linting with ESLint
- Build validation on all platforms

## Environment Variables

The workflow uses these environment variables:

- `GITHUB_TOKEN`: Automatic GitHub token for releases
- `CSC_IDENTITY_AUTO_DISCOVERY: false`: Disables code signing in CI
- `CI: true`: Ensures proper CI behavior in tests

## Platform-Specific Builds

### Windows (`windows-latest`)
- Creates `.exe` installer and `.msi` package
- Uses `package:win` script

### macOS (`macos-latest`) 
- Creates `.dmg` disk image and `.zip` archive
- Uses `package:mac` script
- Code signing disabled for CI (development builds)

### Linux (`ubuntu-latest`)
- Creates `.AppImage`, `.deb`, and `.rpm` packages
- Uses `package:linux` script

## Semantic Release Configuration

The workflow integrates with semantic-release for:
- Automatic version bumping based on commit messages
- Changelog generation
- GitHub release creation
- Asset uploading

## Local Development

To test the workflow locally:

```bash
# Run the same tests as CI
pnpm lint
pnpm test --run
pnpm build
pnpm test:e2e

# Test packaging (development builds)
pnpm package:mac:dev    # macOS
pnpm package:win        # Windows  
pnpm package:linux      # Linux
```

## Troubleshooting

### Common Issues

1. **E2E Tests Failing**
   - Ensure `pnpm build` runs before E2E tests
   - Check that Electron app launches properly
   - Verify test database isolation

2. **Build Artifacts Missing**
   - Check `package:*` scripts in package.json
   - Verify electron-builder configuration
   - Ensure all dependencies are installed

3. **Release Not Created**
   - Check commit message format (conventional commits)
   - Verify GITHUB_TOKEN permissions
   - Ensure semantic-release configuration is correct

### Monitoring

- Check the Actions tab for detailed logs
- PR comments provide status updates
- Build summaries show artifact counts
- Release summaries confirm completion

## Future Improvements

- **Code Signing**: Add production certificate management
- **Performance**: Further optimize build matrix
- **Testing**: Add integration tests for different platforms
- **Monitoring**: Add Slack/Discord notifications for releases
