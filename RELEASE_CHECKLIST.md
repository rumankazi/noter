# Release Checklist

## Pre-Release

### Code Quality
- [ ] All tests passing (`pnpm test --run`)
- [ ] No linting errors (`pnpm lint`)
- [ ] No TypeScript errors (`pnpm build`)
- [ ] Code reviewed and approved

### Features
- [ ] All planned features implemented
- [ ] Features tested manually
- [ ] Edge cases handled
- [ ] Error messages user-friendly

### Documentation
- [ ] README.md updated
- [ ] CHANGELOG.md updated with changes
- [ ] User guides updated if UI changed
- [ ] API docs updated if needed

### Testing
- [ ] Test on Windows (installer and portable)
- [ ] Test on macOS (Intel and Apple Silicon if possible)
- [ ] Test on Linux (AppImage, DEB, RPM)
- [ ] Test database migration (if schema changed)
- [ ] Test upgrade from previous version

---

## Version Bump

### Update Version
```bash
# Choose one:
npm version patch  # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor  # 1.0.0 -> 1.1.0 (new features)
npm version major  # 1.0.0 -> 2.0.0 (breaking changes)
```

### Update Files
- [ ] package.json version updated
- [ ] Update version in main.ts if displayed
- [ ] Update version in CHANGELOG.md

---

## Build and Test

### Local Build
```bash
# Build for current platform
pnpm build
pnpm package

# Test the packaged app
# Windows: release/*.exe
# macOS: release/*.dmg
# Linux: release/*.AppImage
```

### Verify Build
- [ ] App launches correctly
- [ ] No console errors
- [ ] All features work
- [ ] Auto-save works
- [ ] Settings persist
- [ ] Import/export works

---

## Create Release

### Commit and Tag
```bash
# Commit version bump
git add package.json
git commit -m "chore: bump version to v1.x.x"

# Create tag
git tag v1.x.x

# Push
git push origin main
git push origin v1.x.x
```

### GitHub Actions
- [ ] Wait for build workflow to complete
- [ ] Check all three platforms built successfully
- [ ] Download and test artifacts

### Create GitHub Release
GitHub Actions will automatically:
- Create release draft
- Upload installers
- Generate release notes

**Manual steps:**
1. Go to [Releases](https://github.com/rumankazi/noter/releases)
2. Find the new draft release
3. Edit release notes:
   - Add highlights at top
   - Organize changes by category
   - Add screenshots if UI changed
   - Note breaking changes prominently
4. Publish release

---

## Release Notes Template

```markdown
## Noter v1.x.x

### Highlights
- 🎉 Major new feature description
- 🐛 Important bug fixes
- ⚡ Performance improvements

### New Features
- Feature 1 (#123)
- Feature 2 (#124)

### Improvements
- Improvement 1 (#125)
- Improvement 2 (#126)

### Bug Fixes
- Fixed issue with X (#127)
- Fixed crash when Y (#128)

### Breaking Changes
⚠️ **Important:** List any breaking changes here

### Migration Guide
If database schema or settings changed, provide upgrade steps.

### Downloads
- **Windows**: Noter-1.x.x-win-x64.exe (Installer) or Noter-1.x.x-portable.exe
- **macOS**: Noter-1.x.x-mac-x64.dmg (Intel) or Noter-1.x.x-mac-arm64.dmg (Apple Silicon)
- **Linux**: Noter-1.x.x-linux-x64.AppImage, .deb, or .rpm

### System Requirements
- Windows 10+, macOS 10.13+, Ubuntu 18.04+ (or equivalent)

### Checksums
SHA256 checksums will be added automatically by GitHub Actions.

### Full Changelog
See [CHANGELOG.md](https://github.com/rumankazi/noter/blob/main/CHANGELOG.md)
```

---

## Post-Release

### Verify Release
- [ ] Download each platform's installer
- [ ] Test installation
- [ ] Test app launches and works
- [ ] Verify download links work

### Update Documentation
- [ ] Update installation links to point to latest release
- [ ] Update version numbers in docs
- [ ] Add release announcement to README

### Announce
- [ ] Tweet/post on social media
- [ ] Post in relevant communities
- [ ] Update project website if exists
- [ ] Notify users (future: in-app notification)

### Monitor
- [ ] Watch for bug reports
- [ ] Monitor download statistics
- [ ] Check for issues with installers
- [ ] Plan hotfix if critical issues found

---

## Hotfix Process

For critical bugs after release:

```bash
# Create hotfix branch
git checkout -b hotfix/v1.x.y

# Make fixes
# Test thoroughly

# Bump version (patch)
npm version patch

# Commit and tag
git commit -m "fix: critical bug fix"
git tag v1.x.y

# Push
git push origin hotfix/v1.x.y
git push origin v1.x.y

# Merge back to main
git checkout main
git merge hotfix/v1.x.y
git push origin main
```

---

## Release Schedule

### Regular Releases
- **Patch**: As needed (bug fixes)
- **Minor**: Monthly (new features)
- **Major**: Yearly (breaking changes)

### Pre-Release Testing
- **Beta**: 1 week before minor/major releases
- **RC**: 3 days before major releases

---

## Rollback Plan

If release has critical issues:

### Option 1: Quick Hotfix
1. Fix the issue
2. Release patch version immediately
3. Update release notes

### Option 2: Revert Release
1. Mark release as "Pre-release" in GitHub
2. Delete installers from release
3. Pin previous version in README
4. Post notice about issue

### Option 3: Deprecate Version
1. Keep release but add warning
2. Release fixed version ASAP
3. Update docs to skip broken version

---

## Version Strategy

### Semantic Versioning
- **1.0.0 → 1.0.1**: Bug fixes, no new features
- **1.0.0 → 1.1.0**: New features, backwards compatible
- **1.0.0 → 2.0.0**: Breaking changes

### Pre-Release Versions
- **1.0.0-beta.1**: Beta test version
- **1.0.0-rc.1**: Release candidate

---

## Automated Checks

Before creating release, GitHub Actions will:
- [ ] Run all tests
- [ ] Build for all platforms
- [ ] Package installers
- [ ] Calculate checksums
- [ ] Upload artifacts

If any step fails, fix issues before proceeding.

---

## Security

### Code Signing (Future)
- [ ] Sign Windows executables
- [ ] Sign macOS apps
- [ ] Notarize macOS apps

### Checksums
- [ ] Generate SHA256 for each artifact
- [ ] Include in release notes
- [ ] Document verification process

---

## Metrics to Track

After release, monitor:
- Download count per platform
- Crash reports (if telemetry added)
- GitHub issues created
- User feedback
- Performance metrics

---

## Emergency Contacts

If critical issue found:
1. Maintainer: @rumankazi
2. Create issue with `critical` label
3. Consider hotfix release

---

## Template: CHANGELOG.md Entry

```markdown
## [1.x.x] - 2025-10-15

### Added
- New feature X
- New feature Y

### Changed
- Improved Z performance
- Updated UI for A

### Fixed
- Fixed crash when B
- Fixed bug in C

### Deprecated
- Feature D will be removed in v2.0

### Removed
- Removed deprecated feature E

### Security
- Fixed security vulnerability F
```

---

## Checklist Summary

**Before Release:**
- [ ] Tests pass
- [ ] Build works
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Tag created

**During Release:**
- [ ] Build artifacts created
- [ ] Installers tested
- [ ] Release notes written
- [ ] GitHub release published

**After Release:**
- [ ] Downloads verified
- [ ] Announcement made
- [ ] Issues monitored
- [ ] Metrics tracked

**Use this checklist for every release to ensure quality and consistency!**
