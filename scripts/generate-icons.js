#!/usr/bin/env node
/**
 * Icon Generator Script for Noter
 * Generates app icons for all platforms from a base SVG or PNG
 */

import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const ICON_SIZES = {
    ico: [16, 32, 48, 64, 128, 256],
    png: [16, 32, 48, 64, 128, 256, 512, 1024],
    icns: [16, 32, 48, 64, 128, 256, 512, 1024]
};

// Simple Noter icon as SVG
const NOTER_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="64" fill="url(#gradient)"/>
  
  <!-- Note paper -->
  <rect x="128" y="96" width="256" height="320" rx="16" fill="white" opacity="0.95"/>
  
  <!-- Lines on paper -->
  <line x1="160" y1="160" x2="352" y2="160" stroke="#E5E7EB" stroke-width="2"/>
  <line x1="160" y1="192" x2="352" y2="192" stroke="#E5E7EB" stroke-width="2"/>
  <line x1="160" y1="224" x2="320" y2="224" stroke="#E5E7EB" stroke-width="2"/>
  <line x1="160" y1="256" x2="352" y2="256" stroke="#E5E7EB" stroke-width="2"/>
  <line x1="160" y1="288" x2="280" y2="288" stroke="#E5E7EB" stroke-width="2"/>
  
  <!-- Pen/pencil -->
  <rect x="320" y="300" width="48" height="8" rx="4" fill="#F59E0B" transform="rotate(45 344 304)"/>
  <circle cx="360" cy="340" r="6" fill="#DC2626"/>
</svg>`;

async function generateIcons() {
    try {
        console.log('🎨 Generating Noter app icons...');

        // Create build directory if it doesn't exist
        const buildDir = path.join(process.cwd(), 'build');
        await fs.mkdir(buildDir, { recursive: true });

        // Write the SVG file
        const svgPath = path.join(buildDir, 'icon.svg');
        await fs.writeFile(svgPath, NOTER_SVG);
        console.log('✅ Created base SVG icon');

        // Check if ImageMagick is available
        let hasImageMagick = true;
        try {
            execSync('convert -version', { stdio: 'ignore' });
        } catch {
            hasImageMagick = false;
            console.log('⚠️  ImageMagick not found. Install with: brew install imagemagick');
        }

        if (hasImageMagick) {
            // Generate PNG icons
            const pngPath = path.join(buildDir, 'icon.png');
            execSync(`convert "${svgPath}" -resize 512x512 "${pngPath}"`);
            console.log('✅ Generated PNG icon (512x512)');

            // Generate ICO for Windows (multi-resolution)
            const icoPath = path.join(buildDir, 'icon.ico');
            const icoSizes = ICON_SIZES.ico.map(size => `"${svgPath}" -resize ${size}x${size}`).join(' ');
            execSync(`convert ${icoSizes} "${icoPath}"`);
            console.log('✅ Generated ICO icon (multi-resolution)');

            // Generate ICNS for macOS
            const icnsPath = path.join(buildDir, 'icon.icns');
            const iconsetDir = path.join(buildDir, 'icon.iconset');
            await fs.mkdir(iconsetDir, { recursive: true });

            // Generate all required sizes for iconset
            for (const size of ICON_SIZES.icns) {
                const filename = size >= 32 ? `icon_${size}x${size}.png` : `icon_16x16.png`;
                execSync(`convert "${svgPath}" -resize ${size}x${size} "${path.join(iconsetDir, filename)}"`);

                if (size >= 32) {
                    // Also create @2x versions
                    const retinaSize = size * 2;
                    const retinaFilename = `icon_${size}x${size}@2x.png`;
                    execSync(`convert "${svgPath}" -resize ${retinaSize}x${retinaSize} "${path.join(iconsetDir, retinaFilename)}"`);
                }
            }

            // Convert iconset to icns
            execSync(`iconutil -c icns "${iconsetDir}" -o "${icnsPath}"`);

            // Clean up iconset directory
            await fs.rm(iconsetDir, { recursive: true, force: true });

            console.log('✅ Generated ICNS icon for macOS');
        } else {
            console.log('📝 Manual steps needed:');
            console.log('1. Install ImageMagick: brew install imagemagick');
            console.log('2. Run this script again to generate all icon formats');
            console.log('3. Or manually convert build/icon.svg to .ico, .png, and .icns');
        }

        console.log('🎉 Icon generation complete!');
        console.log('📁 Icons saved to build/ directory');

    } catch (error) {
        console.error('❌ Error generating icons:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateIcons();
}

export { generateIcons };
