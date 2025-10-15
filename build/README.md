# Icon Placeholder

This directory should contain app icons for different platforms:

- **icon.ico** (Windows) - 256x256 icon file
- **icon.icns** (macOS) - macOS icon file  
- **icon.png** (Linux) - 512x512 PNG image

## Generating Icons

You can use tools like:
- https://www.electron.build/icons
- https://icon.kitchen/
- Or create manually with design tools

## Required Sizes

### Windows (.ico)
- 256x256
- 128x128
- 64x64
- 48x48
- 32x32
- 16x16

### macOS (.icns)
- 1024x1024
- 512x512
- 256x256
- 128x128
- 64x64
- 32x32
- 16x16

### Linux (.png)
- 512x512 (recommended)
- 256x256 (fallback)

## Temporary Solution

Until proper icons are created, electron-builder will use default icons.

To add your own icons:
1. Create icons in the required formats
2. Place them in this `build/` directory
3. Rebuild the application

## Icon Design Tips

- Use simple, recognizable shapes
- Ensure it looks good at small sizes (16x16)
- Use consistent colors with your app theme
- Test on both light and dark backgrounds
