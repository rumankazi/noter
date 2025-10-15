# Release Workflow Guide

This document explains the automated release workflow for Noter.

## Workflow Types

### 1. Pull Request (PR) Workflow

When a pull request is opened or updated:

- **Validation Build**: Runs full test suite and quick Linux build validation
- **Release Preview**: Shows what version would be released if the PR was merged
- **PR Comment**: Automatically comments on the PR with release preview information

**What gets executed:**
- ✅ Lint checks
- ✅ Unit tests
- ✅ E2E tests  
- ✅ Linux build validation
- ✅ Semantic-release dry-run (preview only)

**What does NOT happen:**
- ❌ No multi-platform builds
- ❌ No actual release created
- ❌ No artifacts uploaded to GitHub

### 2. Main Branch Push Workflow

When code is pushed to the main branch (usually via PR merge):

- **Full Multi-Platform Build**: Builds for Windows, macOS, and Linux
- **Automatic Release**: Creates GitHub release if changes warrant it
- **Artifact Upload**: Uploads all platform binaries to the release

**What gets executed:**
- ✅ Full test suite
- ✅ Multi-platform builds (Windows, macOS, Linux)
- ✅ Semantic-release (actual release creation)
- ✅ GitHub release with all artifacts

### 3. Manual Workflow Dispatch

Manually triggered releases with additional options:

**Available Options:**
- **Release Type**: `auto` (default), `patch`, `minor`, `major`
- **Skip Tests**: Skip test execution (use with caution)
- **Force Release**: Force a release even without significant changes

**Use Cases:**
- Emergency hotfix releases
- Manual version bumps
- Testing the release pipeline

## Semantic Release Behavior

### Conventional Commits

The workflow uses conventional commits to determine release versions:

- `feat:` → **Minor** version bump (new features)
- `fix:` → **Patch** version bump (bug fixes)  
- `perf:` → **Patch** version bump (performance improvements)
- `BREAKING CHANGE:` → **Major** version bump (breaking changes)

### No Release Triggers

These commit types do NOT trigger releases:
- `docs:` (documentation)
- `style:` (formatting, no code changes)
- `test:` (adding tests)
- `build:` (build system changes)
- `ci:` (CI configuration changes)
- `chore:` (maintenance tasks)

## Release Assets

Each release includes platform-specific installers:

### Windows
- **Installer**: `noter-x.x.x-win-setup.exe`
- **Portable**: `noter-x.x.x-win-portable.exe` (if configured)

### macOS  
- **Installer**: `noter-x.x.x-mac.dmg`
- **Archive**: `noter-x.x.x-mac.zip`

### Linux
- **AppImage**: `noter-x.x.x-linux.AppImage` (universal)
- **DEB Package**: `noter-x.x.x-linux.deb` (Debian/Ubuntu)
- **RPM Package**: `noter-x.x.x-linux.rpm` (RedHat/Fedora)

## Testing Releases Locally

### Preview Release Changes
```bash
# See what version would be released
pnpm semantic-release:dry-run
```

### Test Build Process
```bash
# Test full validation (same as PR workflow)
pnpm validate

# Test individual platform builds
pnpm package:win      # Windows
pnpm package:mac      # macOS  
pnpm package:linux    # Linux
pnpm package:all      # All platforms
```

## Troubleshooting

### No Release Created

If no release is created, check:

1. **Commit Messages**: Ensure using conventional commit format
2. **Change Types**: Verify commits include `feat:`, `fix:`, or breaking changes
3. **Workflow Logs**: Check GitHub Actions logs for semantic-release output

### Build Failures

Common issues:

1. **Code Signing**: Development builds use unsigned binaries (intentional)
2. **Dependencies**: Ensure `pnpm install` runs successfully
3. **Tests**: All tests must pass before building

### Manual Release

To force a release manually:

1. Go to **Actions** → **Build and Release**
2. Click **Run workflow**
3. Select options:
   - Set **Force Release** to `true`
   - Choose appropriate **Release Type**
4. Click **Run workflow**

## Environment Variables

The workflow uses these GitHub secrets:

- `GITHUB_TOKEN`: Automatically provided (no setup needed)

For production code signing (future):
- `CSC_LINK`: Certificate file (macOS/Windows)
- `CSC_KEY_PASSWORD`: Certificate password
- `APPLE_ID`: Apple ID for notarization
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password

## Workflow Files

- `.github/workflows/build.yml`: Main CI/CD workflow
- `.releaserc.json`: Semantic-release configuration
- `package.json`: Build scripts and dependencies

## Best Practices

1. **Use Conventional Commits**: Follow the format for automatic versioning
2. **Test PRs**: Always create PRs to validate changes before merging
3. **Review Release Preview**: Check PR comments for release impact
4. **Monitor Releases**: Verify successful releases in GitHub Releases page
5. **Update Dependencies**: Keep build tools and semantic-release plugins updated
