# Developer Guide - Building Noter from Source

## Prerequisites

### Required Software
- **Node.js**: v22+ ([Download](https://nodejs.org/))
- **pnpm**: v9+ (Install: `npm install -g pnpm`)
- **Git**: Latest version

### Platform-Specific Requirements

#### Windows
- Windows 10/11
- Visual Studio Build Tools (for native modules)
  ```cmd
  npm install --global windows-build-tools
  ```

#### macOS
- macOS 10.13+
- Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```

#### Linux
- Ubuntu 18.04+ (or equivalent)
- Build essentials
  ```bash
  sudo apt-get install build-essential
  ```

---

## Getting the Code

```bash
# Clone repository
git clone https://github.com/rumankazi/noter.git
cd noter

# Install dependencies
pnpm install
```

---

## Development Workflow

### Running in Development Mode

```bash
# Start dev server (with hot reload)
pnpm dev
```

This will:
1. Build the main process (Electron backend)
2. Start Vite dev server (React frontend)
3. Launch Electron app with hot reload

The app reloads automatically when you edit renderer code.
For main process changes, restart `pnpm dev`.

### Development Scripts

```bash
# Run only the renderer
pnpm dev:renderer

# Run only the main process
pnpm dev:main

# Build main process manually
pnpm build:main

# Build renderer manually
pnpm build:renderer
```

---

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test --coverage
```

### End-to-End Tests

```bash
# Run E2E tests
pnpm test:e2e
```

### Linting

```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

---

## Building for Production

### Build Application

```bash
# Build everything (renderer + main process)
pnpm build
```

This creates optimized builds in:
- `dist/renderer/` - React app
- `dist/main/` - Electron main process

### Package for Distribution

#### All Platforms
```bash
# Package for current platform
pnpm package

# Package for Windows
pnpm package:win

# Package for macOS
pnpm package:mac

# Package for Linux
pnpm package:linux

# Package for all platforms (requires each OS)
pnpm package:all
```

#### Platform-Specific Packaging

**On Windows:**
```bash
pnpm package:win
# Creates:
# - release/Noter-1.0.0-win-x64.exe (NSIS installer)
# - release/Noter-1.0.0-portable.exe (Portable)
```

**On macOS:**
```bash
pnpm package:mac
# Creates:
# - release/Noter-1.0.0-mac-x64.dmg (Intel)
# - release/Noter-1.0.0-mac-arm64.dmg (Apple Silicon)
# - release/Noter-1.0.0-mac-x64.zip
# - release/Noter-1.0.0-mac-arm64.zip
```

**On Linux:**
```bash
pnpm package:linux
# Creates:
# - release/Noter-1.0.0-linux-x64.AppImage
# - release/Noter-1.0.0-linux-x64.deb
# - release/Noter-1.0.0-linux-x64.rpm
```

### Quick Testing Build

```bash
# Build unpacked app (faster, no installer)
pnpm package:dir
```

Outputs to `release/[platform]-unpacked/` or `release/mac/Noter.app`

---

## Project Structure

```
noter/
├── .github/
│   └── workflows/          # CI/CD workflows
│       ├── build.yml       # Production builds
│       └── dev-build.yml   # Development builds
├── build/                  # App icons and resources
├── dist/                   # Build output (gitignored)
│   ├── main/               # Compiled main process
│   └── renderer/           # Compiled renderer
├── public/                 # Static assets
│   └── sql-wasm.wasm      # SQLite WebAssembly
├── release/                # Packaged apps (gitignored)
├── src/
│   ├── main/               # Electron main process
│   │   ├── database/       # Database layer
│   │   │   └── DatabaseService.ts
│   │   ├── services/       # Business logic
│   │   │   ├── NoteService.ts
│   │   │   ├── FolderService.ts
│   │   │   ├── DefaultFolderService.ts
│   │   │   └── SettingsService.ts
│   │   ├── main.ts         # App entry point
│   │   └── preload.ts      # IPC bridge
│   ├── renderer/           # React application
│   │   ├── src/
│   │   │   ├── components/ # UI components
│   │   │   ├── stores/     # Zustand state
│   │   │   ├── App.tsx     # Root component
│   │   │   └── main.tsx    # Renderer entry
│   │   └── index.html      # HTML template
│   ├── shared/             # Shared types
│   └── tests/              # Test files
├── scripts/                # Build scripts
│   └── create-main-package.js
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript config
├── tsconfig.main.json      # Main process TS config
├── vite.config.ts          # Vite config
├── vitest.config.ts        # Vitest config
├── tailwind.config.js      # Tailwind CSS config
└── eslint.config.mjs       # ESLint config
```

---

## Architecture

### Main Process (Electron Backend)
- Manages SQLite database
- Handles IPC communication
- Creates windows
- Manages app lifecycle

### Renderer Process (React Frontend)
- UI components
- State management (Zustand)
- Markdown editing and preview
- User interactions

### IPC Communication
- `preload.ts` exposes safe APIs to renderer
- Renderer calls `window.electronAPI.*`
- Main process handles via `ipcMain.handle()`

---

## Configuration Files

### TypeScript

**tsconfig.json** - Renderer config
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx"
  }
}
```

**tsconfig.main.json** - Main process config
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "ESNext",
    "outDir": "dist/main"
  }
}
```

### Vite

**vite.config.ts** - Renderer build config
- React plugin
- Path aliases
- Development server settings

### Electron Builder

**package.json** → `build` section
- App metadata
- File inclusions
- Platform-specific settings
- Installer configurations

---

## Adding Features

### 1. Add a New Service

```typescript
// src/main/services/MyService.ts
export class MyService {
  constructor(private db: DatabaseService) {}
  
  async doSomething() {
    // Implementation
  }
}

// src/main/main.ts
import { MyService } from './services/MyService'

this.myService = new MyService(this.databaseService)

// Add IPC handler
ipcMain.handle('my:action', async () => {
  return this.myService.doSomething()
})
```

### 2. Expose to Renderer

```typescript
// src/main/preload.ts
const electronAPI = {
  my: {
    action: () => ipcRenderer.invoke('my:action')
  }
}
```

### 3. Use in Component

```tsx
// src/renderer/src/components/MyComponent.tsx
const handleClick = async () => {
  const result = await window.electronAPI.my.action()
  // Handle result
}
```

### 4. Add Tests

```typescript
// src/tests/MyService.test.ts
import { describe, it, expect } from 'vitest'
import { MyService } from '../main/services/MyService'

describe('MyService', () => {
  it('should do something', () => {
    // Test implementation
  })
})
```

---

## Debugging

### Renderer Process (React)
- Open DevTools in app: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
- Use React DevTools extension
- Console.log works normally

### Main Process (Electron)
```bash
# Run with Node.js debugging
pnpm dev --inspect

# Then attach debugger:
# Chrome: chrome://inspect
# VS Code: Add launch configuration
```

### Database Debugging
```bash
# Install SQLite tools
npm install -g sql.js-cli

# Inspect database
sqlite3 ~/AppData/Local/Noter/noter.db  # Windows
sqlite3 ~/Library/Application\ Support/Noter/noter.db  # macOS
sqlite3 ~/.config/Noter/noter.db  # Linux
```

---

## Performance Tips

### Development
- Use `pnpm dev` for fastest iteration
- Main process changes require restart
- Renderer has hot reload

### Production
- Always run `pnpm build` before packaging
- Use `pnpm package:dir` for quick testing
- Test on target platform before release

---

## Common Issues

### Issue: `pnpm install` fails
**Solution:**
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: `pnpm dev` won't start
**Solution:**
```bash
# Rebuild main process
pnpm build:main
# Then try again
pnpm dev
```

### Issue: Database errors
**Solution:**
```bash
# Delete database and start fresh
# Windows: Delete %LOCALAPPDATA%\Noter
# macOS: Delete ~/Library/Application Support/Noter
# Linux: Delete ~/.config/Noter
```

### Issue: TypeScript errors after update
**Solution:**
```bash
# Reinstall and rebuild
pnpm install
pnpm build
```

---

## CI/CD with GitHub Actions

### Automated Builds

**On Push to Main:**
- Runs tests
- Builds for all platforms
- Creates installers
- Uploads artifacts (30-day retention)

**On Git Tag (v*):**
- Everything above, plus:
- Creates GitHub Release
- Attaches installers to release
- Generates release notes

### Creating a Release

```bash
# Update version in package.json
npm version 1.1.0

# Push tag
git push origin v1.1.0

# GitHub Actions will:
# 1. Build for Windows, macOS, Linux
# 2. Run all tests
# 3. Create release with installers
```

### Manual Workflow Trigger
- Go to Actions tab on GitHub
- Select "Build and Release"
- Click "Run workflow"
- Choose branch

---

## Contributing

### Workflow
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing`
3. Make changes
4. Add tests
5. Run `pnpm lint` and fix issues
6. Run `pnpm test` and ensure all pass
7. Commit: `git commit -m 'Add amazing feature'`
8. Push: `git push origin feature/amazing`
9. Open Pull Request

### Code Style
- Use TypeScript for all code
- Follow existing patterns
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Write tests for new features

### Commit Messages
```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
test: Add tests for service
refactor: Improve code structure
chore: Update dependencies
```

---

## Resources

### Documentation
- [Electron Docs](https://www.electronjs.org/docs/latest)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Vitest Docs](https://vitest.dev/)

### Tools
- [Electron Builder](https://www.electron.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## Getting Help

**Development Questions:**
- Check existing [GitHub Issues](https://github.com/rumankazi/noter/issues)
- Search [Discussions](https://github.com/rumankazi/noter/discussions)
- Create new issue with `question` label

**Bug Reports:**
- Include steps to reproduce
- Include error messages
- Include platform and versions
- Include relevant logs

**Feature Requests:**
- Describe the use case
- Explain current workaround (if any)
- Add mockups if applicable
