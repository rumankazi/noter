#!/usr/bin/env node
/**
 * Release Script for Noter
 * Handles cross-platform builds and releases
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const RELEASE_DIR = 'release';
const PLATFORMS = {
    win: ['win32', 'x64'],
    mac: ['darwin', 'x64', 'arm64'],
    linux: ['linux', 'x64']
};

async function checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');

    try {
        // Check Node.js version
        const nodeVersion = process.version;
        console.log(`✅ Node.js: ${nodeVersion}`);

        // Check pnpm
        execSync('pnpm --version', { stdio: 'ignore' });
        console.log('✅ pnpm: Available');

        // Check electron-builder
        execSync('pnpm exec electron-builder --version', { stdio: 'ignore' });
        console.log('✅ electron-builder: Available');

        return true;
    } catch (error) {
        console.error('❌ Missing prerequisites:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('🧪 Running tests...');

    try {
        execSync('pnpm test --run', { stdio: 'inherit' });
        console.log('✅ Unit tests passed');

        execSync('pnpm lint', { stdio: 'inherit' });
        console.log('✅ Linting passed');

        return true;
    } catch (error) {
        console.error('❌ Tests failed:', error.message);
        return false;
    }
}

async function buildApp() {
    console.log('🏗️  Building application...');

    try {
        execSync('pnpm build', { stdio: 'inherit' });
        console.log('✅ Build completed');
        return true;
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        return false;
    }
}

async function generateAssets() {
    console.log('🎨 Generating assets...');

    try {
        execSync('pnpm icons', { stdio: 'inherit' });
        console.log('✅ Icons generated');
        return true;
    } catch (error) {
        console.warn('⚠️ Icon generation failed, using defaults');
        return true; // Don't fail on icon generation
    }
}

async function packageApp(platform = 'all') {
    console.log(`📦 Packaging for ${platform}...`);

    try {
        const cmd = platform === 'all' ? 'package:all' : `package:${platform}`;
        execSync(`pnpm ${cmd}`, { stdio: 'inherit' });
        console.log(`✅ Packaging completed for ${platform}`);
        return true;
    } catch (error) {
        console.error(`❌ Packaging failed for ${platform}:`, error.message);
        return false;
    }
}

async function listArtifacts() {
    console.log('📋 Generated artifacts:');

    try {
        const releaseDir = path.join(process.cwd(), RELEASE_DIR);
        const files = await fs.readdir(releaseDir);

        const installers = files.filter(f =>
            f.endsWith('.exe') ||
            f.endsWith('.dmg') ||
            f.endsWith('.AppImage') ||
            f.endsWith('.deb') ||
            f.endsWith('.rpm')
        );

        if (installers.length === 0) {
            console.log('❌ No installer artifacts found');
            return false;
        }

        installers.forEach(file => {
            console.log(`  📄 ${file}`);
        });

        return true;
    } catch (error) {
        console.error('❌ Could not list artifacts:', error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Noter Release Process Starting...\n');

    const args = process.argv.slice(2);
    const platform = args[0] || 'all';
    const skipTests = args.includes('--skip-tests');

    // Check prerequisites
    if (!await checkPrerequisites()) {
        process.exit(1);
    }

    // Run tests unless skipped
    if (!skipTests && !await runTests()) {
        console.log('\n💡 Use --skip-tests to skip testing phase');
        process.exit(1);
    }

    // Build application
    if (!await buildApp()) {
        process.exit(1);
    }

    // Generate assets
    if (!await generateAssets()) {
        // Continue anyway
    }

    // Package application
    if (!await packageApp(platform)) {
        process.exit(1);
    }

    // List generated artifacts
    await listArtifacts();

    console.log('\n🎉 Release process completed successfully!');
    console.log(`📂 Check the '${RELEASE_DIR}' directory for installers`);
    console.log('\n📖 Next steps:');
    console.log('  1. Test the installers on target platforms');
    console.log('  2. Create a GitHub release');
    console.log('  3. Upload the installers as release assets');
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled rejection:', error);
    process.exit(1);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
