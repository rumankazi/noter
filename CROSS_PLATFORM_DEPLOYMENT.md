# Cross-Platform Deployment Guide

Noter now supports automated deployment across multiple platforms through GitHub Actions.

## Supported Platforms

### 🍎 macOS
- **Intel (x64)**: `.dmg` installer and `.zip` archive
- **Apple Silicon (arm64)**: `.dmg` installer and `.zip` archive
- **Requirements**: macOS 10.13 or later

### 🪟 Windows
- **64-bit (x64)**: NSIS installer (`.exe`)
- **32-bit (ia32)**: NSIS installer (`.exe`) 
- **Portable**: Standalone executable (`.exe`)
- **Requirements**: Windows 7 or later

### 🐧 Linux
- **AppImage**: Universal Linux binary (`.AppImage`)
- **DEB Package**: For Debian/Ubuntu systems (`.deb`)
- **RPM Package**: For RedHat/Fedora systems (`.rpm`)
- **Architecture**: x64 only
- **Requirements**: Modern Linux distribution

## Build Process

The deployment workflow consists of three stages:

### 1. Testing (`test` job)
- Runs on macOS (fastest for our Node.js/Electron stack)
- Executes unit tests and linting
- Must pass before building

### 2. Building (`build` job)
- **Matrix Strategy**: Parallel builds on macOS, Windows, and Ubuntu
- **Platform-specific packaging**: Uses electron-builder for native builds
- **Artifact Upload**: Stores build outputs for release stage

### 3. Release (`release` job)
- Downloads all platform artifacts
- Uses semantic-release for automated versioning
- Creates GitHub releases with all platform binaries
- Updates CHANGELOG.md automatically

## Electron Builder Configuration

Each platform has optimized build settings in `package.json`:

```json
{
  "build": {
    "win": {
      "target": ["nsis", "portable"],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "build/icon.icns"
    },
    "linux": {
      "target": ["AppImage", "deb", "rpm"],
      "icon": "build/icon.png"
    }
  }
}
```

## Release Assets

Semantic-release automatically attaches these files to GitHub releases:

- `Noter-{version}-mac-x64.dmg` - macOS Intel installer
- `Noter-{version}-mac-arm64.dmg` - macOS Apple Silicon installer
- `Noter-{version}-mac-x64.zip` - macOS Intel archive
- `Noter-{version}-mac-arm64.zip` - macOS Apple Silicon archive
- `Noter-{version}-win-x64.exe` - Windows 64-bit installer
- `Noter-{version}-win-ia32.exe` - Windows 32-bit installer
- `Noter-{version}-portable.exe` - Windows portable
- `Noter-{version}-linux-x64.AppImage` - Linux universal binary
- `Noter-{version}-linux-x64.deb` - Linux DEB package
- `Noter-{version}-linux-x64.rpm` - Linux RPM package

## Local Development

### Build All Platforms
```bash
npm run package:all
```

### Build Specific Platform
```bash
npm run package:mac     # macOS only
npm run package:win     # Windows only  
npm run package:linux   # Linux only
```

### Platform-specific Commands
```bash
npm run package:win:portable  # Windows portable executable
```

## Distribution Strategy

### Automatic Releases
- Triggered on push to `main` or `test-release` branches
- Uses conventional commits for version bumping
- Creates GitHub releases with all platform binaries

### Manual Testing
- Use `workflow_dispatch` to trigger builds manually
- Download artifacts from GitHub Actions for testing
- Test on target platforms before merging to main

## Code Signing

Currently, code signing is disabled in CI:
- `CSC_IDENTITY_AUTO_DISCOVERY: false`

For production releases, consider:
- **Windows**: Authenticode certificate for installer signing
- **macOS**: Apple Developer certificate for app notarization
- **Linux**: GPG signing for package repositories

## Troubleshooting

### Build Failures
- Check platform-specific system dependencies
- Verify electron-builder configuration
- Review GitHub Actions logs for specific errors

### Missing Dependencies (Linux)
The workflow installs required system libraries:
```bash
sudo apt-get install -y libnss3-dev libatk-bridge2.0-dev libxss1 libasound2-dev
```

### Icon Issues
Ensure all icon formats are available:
- `build/icon.icns` (macOS)
- `build/icon.ico` (Windows)  
- `build/icon.png` (Linux)

## Future Enhancements

- ARM64 Linux support
- Windows ARM64 support
- Automated code signing
- Auto-updater integration
- Package repository publishing (Homebrew, Chocolatey, Snap)
