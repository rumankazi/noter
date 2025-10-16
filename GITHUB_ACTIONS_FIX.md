# 🔍 GitHub Actions vs Docker Setup Analysis

## 🚨 **Key Differences Identified**

### **1. GUI Dependencies**

| Environment        | GUI Libraries                         | Status               |
| ------------------ | ------------------------------------- | -------------------- |
| **Docker Ubuntu**  | Full GUI stack (libgtk, libgbm, etc.) | ✅ Working           |
| **GitHub Actions** | Only basic xvfb                       | ❌ Missing libraries |

### **2. Electron Environment**

| Environment        | Sandbox                      | Display             | Permissions   |
| ------------------ | ---------------------------- | ------------------- | ------------- |
| **Docker**         | `ELECTRON_DISABLE_SANDBOX=1` | Container isolation | Non-root user |
| **GitHub Actions** | Default (enabled)            | Host environment    | Root user     |

### **3. Display Setup**

| Environment        | Virtual Display                                  | Extensions  | Background Process        |
| ------------------ | ------------------------------------------------ | ----------- | ------------------------- |
| **Docker**         | `Xvfb :99 -ac +extension GLX +render -noreset &` | GLX, render | Managed by docker-compose |
| **GitHub Actions** | `Xvfb :99 -screen 0 1024x768x24 &`               | None        | Manual process            |

## 🛠️ **Changes Made to Fix Ubuntu CI**

### **Enhanced Ubuntu Job**

```yaml
- name: Setup headless display and GUI libraries
  run: |
    sudo apt-get update
    sudo apt-get install -y \
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
      dbus-x11

- name: Start virtual display
  run: |
    export DISPLAY=:99
    Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset > /dev/null 2>&1 &
    sleep 3
    echo "DISPLAY=:99" >> $GITHUB_ENV

- name: Run E2E tests with enhanced environment
  run: pnpm run test:e2e
  env:
    DISPLAY: ':99'
    ELECTRON_DISABLE_SANDBOX: '1'
```

### **Separated Jobs for Better Isolation**

- ✅ `test-windows` - Windows-specific testing
- ✅ `test-macos` - macOS-specific testing
- ✅ `test-ubuntu` - Enhanced Ubuntu testing (fixed)
- ✅ `test-docker` - Docker container validation for comparison

## 📊 **Expected Results After Fix**

| Platform       | Environment    | Expected E2E Status                  |
| -------------- | -------------- | ------------------------------------ |
| **Windows**    | GitHub Actions | ✅ Should work (was already working) |
| **macOS**      | GitHub Actions | ✅ Should work (was already working) |
| **Ubuntu**     | GitHub Actions | ✅ Should now work (enhanced setup)  |
| **Ubuntu**     | Docker         | ✅ Already working                   |
| **macOS-like** | Docker         | ✅ Already working                   |

## 🔧 **Root Cause Analysis**

### **Why Docker Works but GitHub Actions Ubuntu Failed:**

1. **Missing GUI Libraries**: Docker containers include full GUI library stack
2. **Electron Sandbox**: Docker explicitly disables sandbox, GitHub Actions didn't
3. **Display Extensions**: Docker uses GLX and render extensions, GitHub Actions used basic display
4. **Environment Variables**: Docker setup properly exports and persists DISPLAY variable

### **Why macOS Works in Both:**

- macOS has native GUI support in GitHub Actions runners
- No need for virtual display or additional libraries
- Electron works out-of-the-box

### **Why Windows Works in Both:**

- Windows has native GUI support in GitHub Actions runners
- No additional display server setup needed
- Electron uses native Windows APIs

## 🎯 **Testing Strategy**

The new workflow will test:

1. **Native environments** (Windows, macOS, Ubuntu with enhanced setup)
2. **Docker containers** (Ubuntu + macOS-like for comparison)
3. **Isolated jobs** (easier debugging when failures occur)

This should resolve the Ubuntu CI failures while maintaining Docker container functionality for local cross-platform testing! 🚀
