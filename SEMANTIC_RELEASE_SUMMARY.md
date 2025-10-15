# 🎉 Semantic Release Added!

## What Changed

Noter now has **automated semantic versioning and releases**!

### Before

```bash
# Manual version bump
npm version 1.1.0

# Manual changelog
vim CHANGELOG.md

# Manual tag
git tag v1.1.0
git push origin v1.1.0

# Wait for builds
# Manually create GitHub release
# Manually write release notes
```
⏱️ Time: 15-30 minutes per release
❌ Error-prone
❌ Inconsistent changelogs

### After

```bash
# Write conventional commit
git commit -m "feat: add dark mode"

# Push to main
git push origin main

# Done! 🎉
```
⏱️ Time: 10 seconds
✅ Automatic versioning
✅ Automatic changelog
✅ Automatic releases
✅ Consistent format

---

## How It Works

### 1. Write Conventional Commits

```bash
# New feature → Minor version (1.0.0 → 1.1.0)
git commit -m "feat: add note templates"

# Bug fix → Patch version (1.0.0 → 1.0.1)
git commit -m "fix: resolve auto-save bug"

# Breaking change → Major version (1.0.0 → 2.0.0)
git commit -m "feat!: redesign API

BREAKING CHANGE: API completely redesigned"
```

### 2. Push to Main

```bash
git push origin main
```

### 3. GitHub Actions Automatically:

1. ✅ Runs tests
2. ✅ Builds for Windows, macOS, Linux
3. ✅ Analyzes commits since last release
4. ✅ Determines new version number
5. ✅ Updates `package.json`
6. ✅ Generates/updates `CHANGELOG.md`
7. ✅ Creates Git tag
8. ✅ Creates GitHub Release
9. ✅ Uploads all installers
10. ✅ Commits version and changelog back to repo

**All automatic. Zero manual work.**

---

## Commit Types

| Type | Description | Version Bump | Example |
|------|-------------|--------------|---------|
| `feat` | New feature | Minor | `feat: add folders` |
| `fix` | Bug fix | Patch | `fix: resolve crash` |
| `perf` | Performance | Patch | `perf: faster search` |
| `refactor` | Refactoring | Patch | `refactor: cleanup code` |
| `docs` | Documentation | None | `docs: update guide` |
| `test` | Tests | None | `test: add unit tests` |
| `chore` | Maintenance | None | `chore: update deps` |
| `feat!` or `BREAKING CHANGE` | Breaking | Major | `feat!: redesign API` |

---

## Quick Examples

### Feature Release (1.0.0 → 1.1.0)

```bash
git commit -m "feat: add export to PDF"
git push origin main
# Automatically creates v1.1.0 release!
```

### Bug Fix Release (1.1.0 → 1.1.1)

```bash
git commit -m "fix: resolve memory leak"
git push origin main
# Automatically creates v1.1.1 release!
```

### Multiple Changes

```bash
git commit -m "feat: add templates"
git commit -m "fix: bug A"
git commit -m "fix: bug B"
git push origin main
# Analyzes all commits → creates v1.2.0 (highest bump wins)
```

### Breaking Change (1.2.0 → 2.0.0)

```bash
git commit -m "feat!: new database schema

BREAKING CHANGE: Database format changed.
Users must export and re-import notes."
git push origin main
# Automatically creates v2.0.0 release!
```

---

## What Gets Generated

### Automatic Changelog

```markdown
# Changelog

## [1.1.0](https://github.com/rumankazi/noter/compare/v1.0.0...v1.1.0) (2025-10-15)

### ✨ Features
* add note templates ([abc123](https://github.com/rumankazi/noter/commit/abc123))
* add dark mode support ([def456](https://github.com/rumankazi/noter/commit/def456))

### 🐛 Bug Fixes
* resolve auto-save timing ([ghi789](https://github.com/rumankazi/noter/commit/ghi789))
```

- ✅ Grouped by type
- ✅ Linked to commits
- ✅ Automatic date
- ✅ Comparison links

### Automatic Release Notes

GitHub Release includes:
- Version number
- Date
- Grouped changes (Features, Bug Fixes, etc.)
- All installers attached
- Direct download links

---

## Files Created/Modified

### New Files
- ✅ `.releaserc.json` - Semantic-release configuration
- ✅ `SEMANTIC_RELEASE.md` - Complete guide

### Modified Files
- ✅ `package.json` - Added semantic-release scripts and dependencies
- ✅ `.github/workflows/build.yml` - Integrated semantic-release
- ✅ `DISTRIBUTION_README.md` - Updated with semantic-release info

### Auto-Generated Files
- ✅ `CHANGELOG.md` - Created on first release, updated automatically

---

## Benefits

### For You (Developer)

**Before:**
- ❌ Manually decide version
- ❌ Manually update package.json
- ❌ Manually write changelog
- ❌ Manually create tag
- ❌ Manually create release
- ❌ Manually write release notes
- ⏱️ 15-30 minutes per release
- 🎯 Easy to make mistakes

**After:**
- ✅ Write good commit messages
- ✅ Push to main
- ✅ Everything else automatic
- ⏱️ 10 seconds
- 🎯 No mistakes possible

### For Users

**Before:**
- ⚠️ Inconsistent changelogs
- ⚠️ Unclear what changed
- ⚠️ Irregular releases

**After:**
- ✅ Consistent changelogs
- ✅ Clear version meaning
- ✅ Frequent releases
- ✅ Professional experience

### For Project

**Before:**
- Release friction → fewer releases
- Manual process → errors
- Time-consuming → delays

**After:**
- Zero friction → more releases
- Automated → no errors
- Instant → no delays

---

## Getting Started

### First Semantic Release

```bash
# 1. Install dependencies (if not already)
pnpm install

# 2. Make some changes
git add .

# 3. Commit with conventional format
git commit -m "feat: initial release with semantic versioning"

# 4. Push to main
git push origin main

# 5. Watch GitHub Actions create your first automated release! 🎉
```

### Check Release

1. Go to: https://github.com/rumankazi/noter/actions
2. Watch "Build and Release" workflow
3. When complete, check: https://github.com/rumankazi/noter/releases
4. See your automated release with installers!

---

## Rules

### Version Bumping

Semantic-release analyzes **all commits** since last release:

```
Last release: v1.0.0

Commits:
- feat: feature A    → would bump to 1.1.0
- fix: bug B         → would bump to 1.0.1
- feat: feature C    → would bump to 1.1.0
- docs: update       → no bump

Result: v1.1.0 (highest bump type)
```

### Commit Format Must Be Exact

```bash
# ✅ Correct
git commit -m "feat: add feature"
git commit -m "fix: resolve bug"

# ❌ Wrong (won't trigger release)
git commit -m "Feature: add feature"
git commit -m "Add feature"
git commit -m "feat add feature"  # (missing colon)
```

### Breaking Changes

Either method triggers major bump:

```bash
# Method 1: ! after type
git commit -m "feat!: redesign"

# Method 2: BREAKING CHANGE in footer
git commit -m "feat: redesign

BREAKING CHANGE: Complete redesign"
```

---

## Tips

### ✅ Do This

```bash
# Clear, descriptive commits
git commit -m "feat: add spell checker to editor"

# Reference issues
git commit -m "fix: resolve crash on startup

Fixes #42"

# Use scopes for clarity
git commit -m "feat(editor): add auto-complete"
```

### ❌ Avoid This

```bash
# Vague
git commit -m "feat: stuff"

# Multiple changes
git commit -m "feat: add feature and fix bug"

# Wrong format
git commit -m "Adding new feature"
```

---

## Troubleshooting

### "No release created"

**Check:**
1. Did you use conventional format? `feat:` not `Feature:`
2. Did you use a release type? (`feat`, `fix`, `perf`)
3. Did commits happen since last release?

### "Wrong version"

**Remember:**
- `feat` → 1.0.0 → 1.1.0 (minor)
- `fix` → 1.0.0 → 1.0.1 (patch)
- `feat!` → 1.0.0 → 2.0.0 (major)

Multiple commits: highest bump wins

### "Release failed"

Check GitHub Actions logs for:
- Build errors
- Test failures
- Permission issues

---

## Documentation

Complete guides:
- **[SEMANTIC_RELEASE.md](SEMANTIC_RELEASE.md)** - Full documentation
- **[DISTRIBUTION_README.md](DISTRIBUTION_README.md)** - Distribution setup
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Developer workflow

---

## Comparison

### Manual Releases (Old)

```bash
# Step 1: Decide version
# "Hmm, is this 1.1.0 or 1.0.1?"

# Step 2: Update package.json
npm version 1.1.0

# Step 3: Write changelog
vim CHANGELOG.md
# "What changed since last time?"

# Step 4: Commit
git commit -am "Release v1.1.0"

# Step 5: Create tag
git tag v1.1.0

# Step 6: Push
git push origin main --tags

# Step 7: Wait for builds
# ...wait 20 minutes...

# Step 8: Manually create release
# Go to GitHub, click buttons, write notes

# Step 9: Upload artifacts
# Download from Actions, re-upload to release

# Total: 30 minutes of work
```

### Semantic Release (New)

```bash
# Step 1: Commit
git commit -m "feat: add cool feature"

# Step 2: Push
git push origin main

# Done! Everything else automatic.
# Total: 10 seconds of work
```

---

## Cost

**$0**

Semantic-release is:
- ✅ Free and open source
- ✅ Runs on GitHub Actions (free for public repos)
- ✅ No additional services needed
- ✅ No subscriptions

---

## Summary

**You added:**
- ✅ Semantic-release (automated versioning)
- ✅ Conventional commits (structured messages)
- ✅ Automatic changelog generation
- ✅ Automatic GitHub releases
- ✅ Zero-friction release process

**You can now:**
- ✅ Push commits → instant releases
- ✅ Focus on features, not versioning
- ✅ Consistent, professional changelogs
- ✅ More releases, less work

**Your new workflow:**
```bash
git commit -m "feat: awesome feature"
git push origin main
# That's it! Release happens automatically! 🎉
```

---

## Next Steps

1. **Test it:** Make a commit with `feat:` and push to main
2. **Watch it work:** Check GitHub Actions
3. **See the release:** Check GitHub Releases
4. **Use it:** All future releases are automatic!

---

**Welcome to automated releases! 🚀**

No more manual versioning. No more manual changelogs. Just code and push.
