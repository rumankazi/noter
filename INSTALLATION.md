# Noter - Installation Guide

## For End Users (Non-Developers)

### Quick Download

**Download the latest version for your platform:**

#### Windows
1. Go to [Releases](https://github.com/rumankazi/noter/releases/latest)
2. Download `Noter-1.0.0-win-x64.exe` (installer)
   - OR `Noter-1.0.0-portable.exe` (no installation needed)
3. Run the installer
4. Launch Noter from Start Menu or Desktop

#### macOS
1. Go to [Releases](https://github.com/rumankazi/noter/releases/latest)
2. Download `Noter-1.0.0-mac-x64.dmg` (Intel)
   - OR `Noter-1.0.0-mac-arm64.dmg` (Apple Silicon)
3. Open the DMG file
4. Drag Noter to Applications folder
5. Launch Noter from Applications

#### Linux
1. Go to [Releases](https://github.com/rumankazi/noter/releases/latest)
2. Choose your preferred format:
   - `Noter-1.0.0-linux-x64.AppImage` (recommended - runs anywhere)
   - `Noter-1.0.0-linux-x64.deb` (Debian/Ubuntu)
   - `Noter-1.0.0-linux-x64.rpm` (Fedora/RHEL)

**AppImage:**
```bash
chmod +x Noter-1.0.0-linux-x64.AppImage
./Noter-1.0.0-linux-x64.AppImage
```

**DEB:**
```bash
sudo dpkg -i Noter-1.0.0-linux-x64.deb
```

**RPM:**
```bash
sudo rpm -i Noter-1.0.0-linux-x64.rpm
```

---

## Installation Types

### Windows

#### 1. NSIS Installer (Recommended)
- **File**: `Noter-1.0.0-win-x64.exe`
- **Size**: ~150 MB
- **Features**:
  - Standard installation wizard
  - Choose installation directory
  - Desktop and Start Menu shortcuts
  - Automatic updates (future)
  - Uninstaller included

**Steps:**
1. Download `.exe` file
2. Double-click to run
3. Follow installation wizard
4. Click "Finish"
5. Find Noter in Start Menu

#### 2. Portable Version
- **File**: `Noter-1.0.0-portable.exe`
- **Size**: ~150 MB
- **Features**:
  - No installation required
  - Run from USB drive
  - Keep settings with executable
  - Perfect for trying Noter

**Steps:**
1. Download portable `.exe`
2. Double-click to run
3. That's it!

### macOS

#### 1. DMG Installer (Recommended)
- **File**: `Noter-1.0.0-mac-[x64|arm64].dmg`
- **Size**: ~150 MB
- **Features**:
  - Drag-and-drop installation
  - Properly signed (future)
  - Native macOS app

**Steps:**
1. Download `.dmg` file
2. Double-click to open
3. Drag Noter to Applications
4. Eject DMG
5. Launch from Applications

**First Launch:**
- macOS may warn about unidentified developer
- Right-click Noter → Open → Confirm
- Or: System Preferences → Security → Allow

#### 2. ZIP Archive
- **File**: `Noter-1.0.0-mac-[x64|arm64].zip`
- **Size**: ~150 MB
- Extract and copy to Applications

### Linux

#### 1. AppImage (Recommended)
- **File**: `Noter-1.0.0-linux-x64.AppImage`
- **Size**: ~150 MB
- **Features**:
  - No installation needed
  - Works on any Linux distro
  - Self-contained
  - Portable

**Steps:**
```bash
# Download
wget https://github.com/rumankazi/noter/releases/latest/download/Noter-1.0.0-linux-x64.AppImage

# Make executable
chmod +x Noter-1.0.0-linux-x64.AppImage

# Run
./Noter-1.0.0-linux-x64.AppImage
```

**Optional: Desktop Integration**
```bash
# Create .desktop file
cat > ~/.local/share/applications/noter.desktop << EOF
[Desktop Entry]
Name=Noter
Exec=/path/to/Noter-1.0.0-linux-x64.AppImage
Icon=noter
Type=Application
Categories=Office;
EOF
```

#### 2. DEB Package (Debian/Ubuntu)
- **File**: `Noter-1.0.0-linux-x64.deb`
- **Distros**: Ubuntu, Debian, Linux Mint, Pop!_OS

```bash
sudo dpkg -i Noter-1.0.0-linux-x64.deb
# If dependencies missing:
sudo apt-get install -f
```

Launch: `noter` or from Applications menu

#### 3. RPM Package (Fedora/RHEL)
- **File**: `Noter-1.0.0-linux-x64.rpm`
- **Distros**: Fedora, RHEL, CentOS, openSUSE

```bash
sudo rpm -i Noter-1.0.0-linux-x64.rpm
# Or with yum:
sudo yum install Noter-1.0.0-linux-x64.rpm
```

Launch: `noter` or from Applications menu

---

## System Requirements

### Minimum
- **OS**: Windows 10, macOS 10.13, Ubuntu 18.04 (or equivalent)
- **RAM**: 512 MB
- **Disk**: 200 MB free space
- **Display**: 1024x768

### Recommended
- **OS**: Windows 11, macOS 12+, Ubuntu 22.04+
- **RAM**: 1 GB
- **Disk**: 500 MB free space (for database growth)
- **Display**: 1920x1080

---

## Data Location

After installation, your notes are stored at:

- **Windows**: `C:\Users\YourName\AppData\Local\Noter\noter.db`
- **macOS**: `~/Library/Application Support/Noter/noter.db`
- **Linux**: `~/.config/Noter/noter.db`

You can change this in Settings.

---

## Updating

### Automatic (Future)
Noter will check for updates and notify you.

### Manual
1. Download latest release
2. Install over existing version
3. Your data is preserved

---

## Uninstalling

### Windows
- **Installer Version**: Settings → Apps → Noter → Uninstall
- **Portable Version**: Just delete the .exe file

### macOS
1. Drag Noter from Applications to Trash
2. Empty Trash

### Linux
- **AppImage**: Delete the file
- **DEB**: `sudo apt remove noter`
- **RPM**: `sudo rpm -e noter`

**Note:** Uninstalling does not delete your notes database.
To remove data: Delete the data directory shown above.

---

## Troubleshooting

### Windows: "Windows protected your PC"
This appears because the app isn't signed yet.
- Click "More info"
- Click "Run anyway"

### macOS: "Cannot open because developer cannot be verified"
- Right-click Noter
- Click "Open"
- Click "Open" again in the dialog

Or use Terminal:
```bash
xattr -cr /Applications/Noter.app
```

### Linux: AppImage won't run
```bash
# Install FUSE (if missing)
sudo apt install fuse libfuse2  # Debian/Ubuntu
sudo dnf install fuse-libs      # Fedora
```

### App crashes on startup
1. Delete the database to start fresh:
   - Windows: Delete `%LOCALAPPDATA%\Noter`
   - macOS: Delete `~/Library/Application Support/Noter`
   - Linux: Delete `~/.config/Noter`
2. Restart Noter

### Updates not installing
1. Manually download latest version
2. Uninstall old version
3. Install new version

---

## Building from Source

**Only for developers!** Regular users should use the installers above.

See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for instructions.

---

## Getting Latest Builds

### Stable Releases
- Download from [Releases page](https://github.com/rumankazi/noter/releases)
- Tagged versions: `v1.0.0`, `v1.1.0`, etc.
- Tested and stable

### Development Builds
- Available in [GitHub Actions](https://github.com/rumankazi/noter/actions)
- Click latest "Build and Release" workflow
- Download artifacts at bottom
- **Warning**: May be unstable

---

## Portable Installation

Want to run Noter from a USB drive?

### Windows
1. Download portable `.exe`
2. Copy to USB drive
3. Run from USB
4. Data saves next to executable

### macOS/Linux
1. Download AppImage or create zip
2. Copy to USB drive
3. Run from USB
4. Data saves to USB (configure in Settings)

---

## Silent Installation (Enterprise)

### Windows NSIS
```cmd
Noter-1.0.0-win-x64.exe /S /D=C:\Program Files\Noter
```

### Linux DEB
```bash
sudo apt-get install -y ./Noter-1.0.0-linux-x64.deb
```

---

## Verification (Future)

All releases will be signed. To verify:

### Windows
- Right-click installer → Properties → Digital Signatures

### macOS
```bash
codesign -dv --verbose=4 /Applications/Noter.app
```

### Linux
- Check SHA256 checksums in release notes

---

## Support

**Installation problems?**
1. Check [Troubleshooting](#troubleshooting) above
2. See [Common Issues](https://github.com/rumankazi/noter/issues?q=label%3Ainstallation)
3. Open new issue with:
   - Your OS and version
   - Which installer you used
   - Error messages
   - What you've tried

**Need help?**
- [GitHub Issues](https://github.com/rumankazi/noter/issues)
- [Discussions](https://github.com/rumankazi/noter/discussions)
