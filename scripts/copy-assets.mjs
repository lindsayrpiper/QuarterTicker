import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
copyFileSync('src/index.html', 'dist/index.html');
copyFileSync('src/styles.css', 'dist/styles.css');
console.log('Copied index.html and styles.css to dist/');
