# Noter

A lightweight, fast, cross-platform note-taking app that works offline without requiring installation.

## 🚀 Features

- **Offline-first**: Works completely offline with local database storage
- **Cross-platform**: Windows, macOS, and Linux support
- **Folder Management**: Create folders and organize notes
- **Drag & Drop**: Move notes between folders easily
- **Auto-save**: Automatic saving on focus change
- **Live Preview**: Side panel for markdown preview
- **Markdown Support**: Full markdown formatting with linting
- **Search**: Quick search across all notes
- **No Installation**: Portable executable, ready to go

## 🏗️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/rumankazi/noter.git
cd noter

# Install dependencies
pnpm install

# Start development
pnpm run dev

# In another terminal, start the Electron app
pnpm run electron:dev
```

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build the app for production
- `pnpm run start` - Build and run the app
- `pnpm test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm run lint` - Lint the code
- `pnpm run format` - Format the code
- `pnpm run dist` - Build distributables for current platform
- `pnpm run dist:all` - Build distributables for all platforms

## 🧪 Testing

This project follows Test-Driven Development (TDD):

- Unit tests with Jest
- E2E tests with Playwright
- Tests run automatically in CI/CD

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm run test:e2e
```

## 🏛️ Architecture

The app follows clean architecture principles:

- **Main Process**: Electron main process (Node.js)
- **Renderer Process**: React-based UI
- **Database**: SQLite for offline storage
- **State Management**: Context API + Hooks

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 📦 Building & Distribution

### Development Builds

```bash
pnpm run build
pnpm run electron
```

### Production Builds

```bash
# Build for current platform
pnpm run dist

# Build for all platforms (Windows, macOS, Linux)
pnpm run dist:all
```

### Supported Formats

- **Windows**: NSIS installer, Portable executable
- **macOS**: DMG (Intel & Apple Silicon)
- **Linux**: AppImage, DEB package

## 🚀 Deployment

The project uses automated deployment:

- **CI/CD**: GitHub Actions
- **Releases**: Semantic Release
- **Git Hooks**: Husky with commitlint

Deployment happens automatically when:

- PR is merged to main branch
- Manual workflow dispatch on main branch

## 🤝 Contributing

1. Follow TDD approach - write tests first
2. Use conventional commits (enforced by commitlint)
3. Code is self-documenting - avoid external documentation
4. Keep architecture document updated
5. All changes should include appropriate tests

### Commit Message Format

```
type(scope): description

feat: add new feature
fix: bug fix
docs: documentation changes
test: add tests
refactor: code refactoring
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📊 Project Status

See [PROGRESS.md](./PROGRESS.md) for current development progress and roadmap.
