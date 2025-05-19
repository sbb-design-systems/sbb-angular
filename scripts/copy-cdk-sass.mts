import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const cdkPath = fileURLToPath(new URL('../node_modules/@angular/cdk/', import.meta.url));
const stylesPath = fileURLToPath(new URL('../src/angular/styles/cdk', import.meta.url));
mkdirSync(stylesPath, { recursive: true });
readdirSync(cdkPath, { withFileTypes: true, recursive: true })
  .filter((d) => d.name.endsWith('.scss') && !d.name.includes('deprecated'))
  .forEach((d) => {
    const srcPath = join(d.parentPath, d.name);
    const targetPath = join(stylesPath, relative(cdkPath, srcPath));
    mkdirSync(dirname(targetPath), { recursive: true });
    copyFileSync(srcPath, targetPath);
  });
