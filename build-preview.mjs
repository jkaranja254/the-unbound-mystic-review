import { copyFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = process.cwd();
const distPath = resolve(projectRoot, 'dist');
const filesToCopy = [
  'index.html',
  'disclaimer.html',
  'privacy-policy.html',
  'styles.css',
  'script.js',
  'terms-of-service.html',
  'guidance-symbolic.webp',
  'IMG-20260820-WA0064.jpg',
  'IMG-20260820-WA0065.jpg',
  'unbound-mystic-logo.png'
];

await rm(distPath, { recursive: true, force: true });
await mkdir(distPath, { recursive: true });

await Promise.all(
  filesToCopy.map((file) =>
    copyFile(resolve(projectRoot, file), resolve(distPath, file))
  )
);

console.log(distPath);
