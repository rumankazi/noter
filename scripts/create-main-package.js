import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const packageJsonPath = 'dist/main/package.json';
const content = JSON.stringify({
    type: 'commonjs',
    main: 'main.js'
}, null, 2);

try {
    mkdirSync(dirname(packageJsonPath), { recursive: true });
    writeFileSync(packageJsonPath, content, 'utf8');
    console.log('Created dist/main/package.json');
} catch (error) {
    console.error('Failed to create package.json:', error);
    process.exit(1);
}
