import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const root = resolve(__dirname, '..');
const lcovFile = join(root, 'coverage', 'lcov.info');
let lcovContent = readFileSync(lcovFile, 'utf8');
while (lcovContent.indexOf(root) > 0) {
    lcovContent = lcovContent.replace(root, '.');
}
writeFileSync(lcovFile, lcovContent, 'utf8');
