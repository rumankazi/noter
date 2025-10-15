# Semantic Release Guide

## Overview

Noter now uses **semantic-release** for automated versioning and releases. This means:
- ✅ **Automatic version bumping** based on your commit messages
- ✅ **Automatic changelog generation**
- ✅ **Automatic GitHub releases**
- ✅ **No manual version management needed**

---

## How It Works

### 1. You Write Conventional Commits

```bash
# Feature (minor version bump: 1.0.0 → 1.1.0)
git commit -m "feat: add dark mode support"

# Bug fix (patch version bump: 1.0.0 → 1.0.1)
git commit -m "fix: resolve auto-save issue"

# Breaking change (major version bump: 1.0.0 → 2.0.0)
git commit -m "feat!: redesign settings API

BREAKING CHANGE: Settings API has been redesigned"
```

### 2. You Push to Main

```bash
git push origin main
```

### 3. GitHub Actions Automatically:
1. ✅ Builds for Windows, macOS, Linux
2. ✅ Runs tests
3. ✅ Analyzes commits to determine version
4. ✅ Updates version in `package.json`
5. ✅ Generates `CHANGELOG.md`
6. ✅ Creates Git tag
7. ✅ Creates GitHub Release
8. ✅ Uploads installers to release

### 4. Users Download New Version
Release appears at: https://github.com/rumankazi/noter/releases/latest

---

## Commit Message Format

### Structure
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types and Version Bumps

| Type | Description | Version Bump | Example |
|------|-------------|--------------|---------|
| `feat` | New feature | **Minor** (1.0.0 → 1.1.0) | `feat: add note tagging` |
| `fix` | Bug fix | **Patch** (1.0.0 → 1.0.1) | `fix: resolve crash on startup` |
| `perf` | Performance improvement | **Patch** (1.0.0 → 1.0.1) | `perf: optimize database queries` |
| `refactor` | Code refactoring | **Patch** (1.0.0 → 1.0.1) | `refactor: simplify note service` |
| `revert` | Revert previous commit | **Patch** (1.0.0 → 1.0.1) | `revert: remove dark mode` |
| `docs` | Documentation only | **No release** | `docs: update installation guide` |
| `style` | Code style changes | **No release** | `style: format with prettier` |
| `test` | Tests only | **No release** | `test: add folder service tests` |
| `build` | Build system changes | **No release** | `build: update dependencies` |
| `ci` | CI/CD changes | **No release** | `ci: add coverage reporting` |
| `chore` | Other changes | **No release** | `chore: update gitignore` |

### Breaking Changes = Major Version

Any commit with `BREAKING CHANGE:` in the footer or `!` after the type triggers a **major** version bump (1.0.0 → 2.0.0):

```bash
# Method 1: Using !
git commit -m "feat!: redesign folder structure"

# Method 2: Using footer
git commit -m "feat: change database schema

BREAKING CHANGE: Database schema has changed. Users must export and re-import data."
```

---

## Examples

### Good Commits

```bash
# ✅ Feature
git commit -m "feat: add export to markdown"

# ✅ Bug fix
git commit -m "fix: prevent duplicate notes"

# ✅ Performance
git commit -m "perf: reduce memory usage by 30%"

# ✅ With scope
git commit -m "feat(editor): add spell checker"

# ✅ With body
git commit -m "fix: resolve settings not saving

The settings service was not properly persisting data to the database.
This commit adds proper error handling and ensures all settings are saved."

# ✅ Breaking change
git commit -m "feat!: redesign settings API

BREAKING CHANGE: The settings API has been completely redesigned.
Old settings data will not be migrated automatically."
```

### Bad Commits (Will Not Trigger Release)

```bash
# ❌ No type
git commit -m "add new feature"

# ❌ Wrong format
git commit -m "Feature: add dark mode"

# ❌ Vague description
git commit -m "feat: stuff"

# ❌ Multiple changes
git commit -m "feat: add feature and fix bug and update docs"
```

---

## Release Process

### Automatic (Recommended)

Just push conventional commits to main:

```bash
# Make changes
git add .

# Commit with conventional format
git commit -m "feat: add note templates"

# Push to main
git push origin main

# GitHub Actions handles the rest!
# - Builds all platforms
# - Determines version (1.0.0 → 1.1.0)
# - Updates package.json
# - Generates CHANGELOG.md
# - Creates tag and release
# - Uploads installers
```

### Manual (Testing Only)

If you need to test locally:

```bash
# Install dependencies
pnpm install

# Build application
pnpm build

# Package for all platforms (requires each OS)
pnpm package:all

# Run semantic-release locally
pnpm semantic-release
```

**Note:** Local runs should only be for testing. Let GitHub Actions handle production releases.

---

## What Gets Released

### Version Determination

Semantic-release analyzes **all commits** since the last release:

```bash
# If you have these commits since v1.0.0:
feat: add feature A        # → minor bump
fix: bug fix B             # → patch bump
feat: add feature C        # → minor bump
docs: update readme        # → no release

# Result: v1.1.0 (highest bump type wins)
```

### Multiple Commits

```bash
# Last release: v1.0.0
git commit -m "fix: bug 1"      # patch
git commit -m "fix: bug 2"      # patch
git commit -m "feat: feature"   # minor
git push origin main

# Result: v1.1.0 (minor > patch)
```

```bash
# Last release: v1.1.0
git commit -m "fix: bug"        # patch
git commit -m "feat!: breaking" # major
git push origin main

# Result: v2.0.0 (major > all)
```

---

## Release Assets

Each release includes:

### Windows
- `Noter-X.X.X-win-x64.exe` - 64-bit installer
- `Noter-X.X.X-win-ia32.exe` - 32-bit installer
- `Noter-X.X.X-portable.exe` - Portable version

### macOS
- `Noter-X.X.X-mac-x64.dmg` - Intel Mac installer
- `Noter-X.X.X-mac-arm64.dmg` - Apple Silicon installer
- `Noter-X.X.X-mac-x64.zip` - Intel Mac archive
- `Noter-X.X.X-mac-arm64.zip` - Apple Silicon archive

### Linux
- `Noter-X.X.X-linux-x64.AppImage` - Universal AppImage
- `Noter-X.X.X-linux-x64.deb` - Debian package
- `Noter-X.X.X-linux-x64.rpm` - RPM package

---

## Changelog

Semantic-release automatically generates `CHANGELOG.md`:

```markdown
# Changelog

## [1.1.0](https://github.com/rumankazi/noter/compare/v1.0.0...v1.1.0) (2025-10-15)

### ✨ Features
* add note templates ([abc123](https://github.com/rumankazi/noter/commit/abc123))
* add dark mode support ([def456](https://github.com/rumankazi/noter/commit/def456))

### 🐛 Bug Fixes
* resolve auto-save timing ([ghi789](https://github.com/rumankazi/noter/commit/ghi789))
```

The changelog is:
- ✅ Automatically updated on each release
- ✅ Grouped by commit type
- ✅ Linked to commits
- ✅ Committed back to repository

---

## Skip Release

Sometimes you want to push to main without triggering a release:

```bash
# Add [skip ci] or [skip release] to commit message
git commit -m "docs: update readme [skip ci]"
git push origin main

# Or in the commit body
git commit -m "chore: update dependencies

[skip ci]"
```

**Note:** Commits with `docs`, `style`, `test`, `build`, `ci`, or `chore` types won't trigger releases anyway.

---

## Troubleshooting

### No Release Created

**Check:**
1. Did you use conventional commit format?
2. Did you use a release-triggering type (`feat`, `fix`, `perf`, `refactor`)?
3. Are there commits since the last release?
4. Did you add `[skip ci]`?

**Debug:**
```bash
# Check your commit messages
git log --oneline

# Verify they follow conventional format
# ✅ feat: description
# ✅ fix: description
# ❌ Add feature
```

### Wrong Version Bumped

**Remember:**
- `feat` → Minor (1.0.0 → 1.1.0)
- `fix` → Patch (1.0.0 → 1.0.1)
- `BREAKING CHANGE` or `!` → Major (1.0.0 → 2.0.0)
- Highest bump type wins

### Release Failed

1. Check GitHub Actions logs
2. Common issues:
   - Build failed
   - Tests failed
   - Missing GITHUB_TOKEN permissions
   - Network issues

### Want to Redo Release

**Don't!** Semantic versioning is immutable. If there's an issue:
1. Fix the problem
2. Commit fix: `fix: resolve issue from v1.1.0`
3. Push → New patch release (v1.1.1)

---

## Migration from Manual Releases

### Old Way

```bash
# Manual version bump
npm version 1.1.0

# Manual changelog
echo "## v1.1.0\n- Feature X\n- Bug fix Y" >> CHANGELOG.md

# Manual commit and tag
git commit -am "chore: v1.1.0"
git tag v1.1.0

# Manual push
git push origin main --tags

# Wait for GitHub Actions
# Manually edit release notes
```

### New Way

```bash
# Just push conventional commits
git commit -m "feat: add feature X"
git commit -m "fix: resolve bug Y"
git push origin main

# Everything else is automatic! 🎉
```

---

## Best Practices

### ✅ Do

- Write clear, descriptive commit messages
- Use conventional commit format
- Group related changes in one commit
- Reference issues in commit body: `Closes #123`
- Use scopes for clarity: `feat(editor): add feature`

### ❌ Don't

- Mix multiple unrelated changes in one commit
- Use vague descriptions: "fix stuff"
- Forget the colon: `feat add feature`
- Use wrong types: `Feature:` instead of `feat:`
- Manually edit version in package.json
- Manually create tags

---

## Configuration

### `.releaserc.json`

The semantic-release configuration:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}
```

**What each plugin does:**
- `commit-analyzer` - Analyzes commits to determine version
- `release-notes-generator` - Generates release notes
- `changelog` - Updates CHANGELOG.md
- `npm` - Updates package.json (no npm publish)
- `git` - Commits package.json and CHANGELOG.md back
- `github` - Creates GitHub release with installers

---

## Examples by Use Case

### Feature Release

```bash
# Develop feature
git checkout -b feature/templates

# Make changes
git add .
git commit -m "feat: add note templates

Users can now create notes from predefined templates.
Includes 5 default templates for common use cases."

# Merge to main
git checkout main
git merge feature/templates
git push origin main

# Result: v1.0.0 → v1.1.0
```

### Bug Fix Release

```bash
git commit -m "fix: resolve crash when deleting folders

Fixed a null pointer exception that occurred when deleting
folders containing more than 100 notes.

Closes #42"

git push origin main

# Result: v1.1.0 → v1.1.1
```

### Breaking Change Release

```bash
git commit -m "feat!: redesign plugin system

BREAKING CHANGE: The plugin API has been completely redesigned.
Old plugins will not work and must be updated.

Migration guide: docs/MIGRATION.md"

git push origin main

# Result: v1.1.1 → v2.0.0
```

### Hotfix Release

```bash
# Critical bug in production
git commit -m "fix: resolve data loss bug

CRITICAL: Fixed bug that could cause data loss when
auto-save triggered during folder deletion.

All users should update immediately."

git push origin main

# Result: v1.1.1 → v1.1.2 (releases immediately)
```

---

## Summary

**Before semantic-release:**
- Manual version management
- Manual changelog writing
- Manual tag creation
- Manual release notes
- Error-prone process

**With semantic-release:**
- ✅ Write conventional commits
- ✅ Push to main
- ✅ Everything else automatic
- ✅ Consistent versioning
- ✅ Professional changelogs

**Your job:** Write good commit messages
**Semantic-release's job:** Everything else

---

## Quick Reference

```bash
# Feature (1.0.0 → 1.1.0)
git commit -m "feat: description"

# Bug fix (1.0.0 → 1.0.1)
git commit -m "fix: description"

# Breaking change (1.0.0 → 2.0.0)
git commit -m "feat!: description"

# No release
git commit -m "docs: description"
git commit -m "chore: description"
git commit -m "test: description"

# Skip CI
git commit -m "docs: description [skip ci]"
```

---

**Questions?** 
- See commit history for examples
- Check GitHub Actions logs for release details
- Refer to [Conventional Commits](https://www.conventionalcommits.org/)
