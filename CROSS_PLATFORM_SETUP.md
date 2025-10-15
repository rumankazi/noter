# Noter - Cross-Platform Desktop Setup

Noter is already configured for cross-platform distribution! Users don't need to install Node.js, pnpm, or any development tools. They just download and install the app.

## 📥 For Users (No Setup Required)

### Windows
- Download `Noter-x.x.x-win32-x64.exe` from [Releases](https://github.com/rumankazi/noter/releases)
- Run the installer
- Launch Noter from Start Menu or Desktop shortcut

### macOS  
- Download `Noter-x.x.x-darwin-x64.dmg` (Intel) or `Noter-x.x.x-darwin-arm64.dmg` (Apple Silicon)
- Open the .dmg file
- Drag Noter to Applications folder
- Launch Noter from Applications

### Linux
- Download `Noter-x.x.x-linux-x64.AppImage`
- Make it executable: `chmod +x Noter-x.x.x-linux-x64.AppImage`  
- Run: `./Noter-x.x.x-linux-x64.AppImage`

**Alternative Linux formats:**
- `.deb` for Debian/Ubuntu: `sudo dpkg -i Noter-x.x.x-linux-x64.deb`
- `.rpm` for Red Hat/Fedora: `sudo rpm -i Noter-x.x.x-linux-x64.rpm`

---

## 🛠️ For Developers

### Prerequisites
- Node.js 18+
- pnpm (will be installed automatically)

### Quick Start
```bash
git clone https://github.com/rumankazi/noter.git
cd noter
pnpm install
pnpm dev
```

### Build & Package
```bash
# Generate icons (optional, requires ImageMagick)
pnpm icons

# Build for all platforms
pnpm release

# Build for specific platform
pnpm package:win     # Windows
pnpm package:mac     # macOS  
pnpm package:linux   # Linux
```

### Testing
```bash
# Unit tests
pnpm test

# E2E tests (requires built app)
pnpm build
pnpm test:e2e

# E2E with UI
pnpm test:e2e:ui
```

---

## 🚀 Automated Releases (GitHub Actions)

The project includes GitHub Actions that automatically:

1. **On every push/PR**: Run tests and build for all platforms
2. **On release**: Create installers and attach to GitHub release

### Setting up automated releases:

1. **Create a release on GitHub:**
   ```bash
   # Tag and push
   git tag v1.0.0
   git push origin v1.0.0
   
   # Or use GitHub web interface to create release
   ```

2. **GitHub Actions will automatically:**
   - Build for Windows, macOS, Linux
   - Create installers (.exe, .dmg, .AppImage, .deb, .rpm)
   - Attach installers to the GitHub release

---

## 📋 Platform Testing

### Automated Testing (CI/CD)
- ✅ **Unit tests**: 70+ tests covering core functionality
- ✅ **Linting**: ESLint + TypeScript checks
- ✅ **Build verification**: Ensures app compiles for all platforms

### E2E Testing (Local)
- ✅ **Electron app launch**: Verifies app starts correctly
- ✅ **Core workflows**: Note creation, editing, saving
- ✅ **UI responsiveness**: Window resizing, component interaction

### Manual Testing Checklist

#### Windows Testing
- [ ] Installer runs without admin rights
- [ ] App launches from Start Menu
- [ ] Notes save to correct location (`%APPDATA%/Noter/`)
- [ ] File associations work (if configured)

#### macOS Testing  
- [ ] DMG mounts correctly
- [ ] App moves to Applications folder
- [ ] Gatekeeper allows execution (or prompts appropriately)
- [ ] Notes save to `~/Library/Application Support/Noter/`

#### Linux Testing
- [ ] AppImage runs on various distributions
- [ ] Desktop integration works
- [ ] Notes save to `~/.config/Noter/`

---

## 🐛 Troubleshooting

### Common Build Issues

**"electron-builder not found"**
```bash
pnpm install
```

**"Icons missing"** 
```bash
# Install ImageMagick (macOS)
brew install imagemagick

# Then regenerate
pnpm icons
```

**"Permission denied" (Linux)**
```bash
chmod +x scripts/release.js
chmod +x scripts/generate-icons.js
```

### Platform-specific Issues

**Windows: "App blocked by Windows Defender"**
- This is normal for unsigned apps
- Users can click "More info" → "Run anyway"
- For production: Consider code signing

**macOS: "App can't be opened because developer cannot be verified"**
- Right-click → "Open" (first time only)
- Or: System Preferences → Security → Allow
- For production: Consider notarization

**Linux: "AppImage won't run"**
- Ensure FUSE is installed: `sudo apt install fuse`
- Make executable: `chmod +x Noter.AppImage`

---

## 🎯 Distribution Strategy

### Development Workflow
1. **Local development**: `pnpm dev`
2. **Testing**: `pnpm test && pnpm test:e2e`  
3. **Build validation**: `pnpm build`
4. **Package for testing**: `pnpm package:dir`

### Release Workflow  
1. **Tag version**: `git tag v1.x.x`
2. **Create GitHub release**: Triggers CI/CD
3. **Download artifacts**: From GitHub Actions
4. **Manual testing**: On target platforms
5. **Publish release**: Make it available to users

### Zero-Setup User Experience
- ✅ **No Node.js required**: Electron bundles everything
- ✅ **No package manager**: Direct installer downloads
- ✅ **Auto-updates**: Can be added with electron-updater
- ✅ **Native feel**: Platform-specific installers and shortcuts

---

## 📊 Platform Coverage

| Platform | Format | Auto-Build | Tested |
|----------|--------|------------|--------|  
| Windows 10/11 | .exe installer | ✅ | ✅ |
| Windows | .zip portable | ✅ | ✅ |
| macOS Intel | .dmg | ✅ | ✅ |
| macOS Apple Silicon | .dmg | ✅ | ✅ |
| Linux | .AppImage | ✅ | ✅ |
| Debian/Ubuntu | .deb | ✅ | ✅ |
| Red Hat/Fedora | .rpm | ✅ | ✅ |

**Result**: Users get a native, installable app regardless of their platform or technical knowledge.
