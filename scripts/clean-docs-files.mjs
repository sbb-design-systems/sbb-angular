import { readdirSync, unlinkSync } from 'fs';
import { resolve, join } from 'path';

/* eslint-disable @typescript-eslint/no-var-requires */
const allowedExtensions =
    /^\.(s?css|html?|m?js|json|ts|map|ico|jpe?g|png|svg|woff2|txt|gitignore|gitkeep|stackblitzrc)$/,
  distDir = resolve('dist/docs');

// Removes all files not matching allowed extensions from given directory.
readdirSync(distDir, { withFileTypes: true, recursive: true })
  .filter((d) => d.isFile() && !allowedExtensions.test(path.extname(d.name)))
  .forEach((d) => {
    console.log(`Removing ${join(d.parentPath, d.name)}`);
    unlinkSync(join(d.parentPath, d.name));
  });
