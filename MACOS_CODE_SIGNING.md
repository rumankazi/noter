# macOS Code Signing Guide for Noter

## Overview
This guide explains how to properly sign and notarize the Noter app for macOS distribution.

## Development vs Production

### Development (Current Setup)
- **Identity**: `null` (no signing)
- **Gatekeeper**: disabled
- **Usage**: Local testing only
- **Command**: `npm run package:mac:dev`

### Production (Requires Apple Developer Account)
- **Identity**: Apple Developer Certificate
- **Notarization**: Required for distribution
- **Usage**: App Store or direct distribution
- **Command**: `npm run package:mac:prod`

## Quick Fix for Testing

If you're getting the "damaged app" error, run:

```bash
# Remove quarantine attributes
xattr -cr release/mac/Noter.app

# Allow unsigned apps (one-time per app)
sudo spctl --add release/mac/Noter.app
sudo spctl --enable --label "Noter"
```

## Production Code Signing Setup

### 1. Prerequisites
- Apple Developer Account ($99/year)
- Developer ID Application certificate
- Developer ID Installer certificate (for DMG)

### 2. Install Certificates
1. Download certificates from Apple Developer Portal
2. Import into Keychain Access
3. Verify with: `security find-identity -v -p codesigning`

### 3. Update Environment Variables
```bash
# Add to your .env or CI secrets
export APPLE_ID="your-apple-id@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="XXXXXXXXXX"
```

### 4. Enable Production Signing
Update package.json to use your certificate:
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (XXXXXXXXXX)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "notarize": {
        "teamId": "XXXXXXXXXX"
      }
    }
  }
}
```

## Current Configuration

The current setup uses:
- `"identity": null` - Disables code signing
- `"gatekeeperAssess": false` - Bypasses some security checks
- `"hardenedRuntime": false` - Disables runtime hardening

This is **safe for development** but **not suitable for distribution**.

## Testing Checklist

### Local Testing
- [ ] App builds without errors
- [ ] App opens without "damaged" error
- [ ] All features work correctly
- [ ] No console errors in dev tools

### Distribution Testing
- [ ] App is properly signed
- [ ] App is notarized by Apple
- [ ] DMG mounts correctly
- [ ] App installs from DMG
- [ ] App launches from Applications folder

## Common Issues

### "App is damaged" Error
**Cause**: Unsigned app blocked by Gatekeeper
**Fix**: Use development build or remove quarantine attributes

### Notarization Fails
**Cause**: Missing entitlements or invalid certificate
**Fix**: Check hardened runtime requirements and certificate validity

### DMG Won't Mount
**Cause**: DMG not signed or corrupted
**Fix**: Rebuild with proper signing configuration

## Commands Reference

```bash
# Development build (unsigned)
npm run package:mac:dev

# Production build (signed - requires certificates)
npm run package:mac:prod

# Check app signature
codesign -dv --verbose=4 release/mac/Noter.app

# Remove quarantine
xattr -cr release/mac/Noter.app

# Test app directly
open release/mac/Noter.app

# Check notarization status
xcrun stapler validate release/mac/Noter.app
```

## Security Notes

- Never distribute unsigned apps to users
- Always use proper certificates for production
- Test on clean systems before release
- Keep certificates secure and rotate regularly
