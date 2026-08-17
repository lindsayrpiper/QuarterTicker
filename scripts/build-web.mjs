import { copyFileSync, mkdirSync } from 'node:fs';

// Static assets for the web build live alongside the bundled renderer in site/.
mkdirSync('site', { recursive: true });
copyFileSync('src/index.html', 'site/index.html');
copyFileSync('src/styles.css', 'site/styles.css');
console.log('Copied index.html and styles.css to site/');
