const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { join } = require('path');
const { version } = require('../package.json');

const distDir = join(__dirname, '../dist');
const packagesDistDir = join(distDir, 'sbb-esta');
const packageJsons = [
  join(distDir, 'angular-showcase'),
  ...readdirSync(packagesDistDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join(packagesDistDir, d.name)),
].map((d) => join(d, 'package.json'));
console.log(`Assigning version ${version}:\n${packageJsons.map((p) => `  - ${p}`).join('\n')}`);

for (const pkg of packageJsons) {
  const content = readFileSync(pkg, 'utf8');
  writeFileSync(pkg, content.replace(/0\.0\.0-PLACEHOLDER/g, version), 'utf8');
}
