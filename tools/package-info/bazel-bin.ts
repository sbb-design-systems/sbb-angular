import { writeFileSync } from 'fs';

if (require.main === module) {
  const [outputFile] = process.argv.slice(2);
  const packageJson = require('../../package.json');
  writeFileSync(
    outputFile,
    `/** THIS FILE IS AUTO-GENERATED! DO NOT MODIFY! */
export const angularVersion = '${packageJson.dependencies['@angular/core'].replace(/[^\d.]/, '')}';
export const libraryVersion = '${packageJson.version}';`,
    'utf8'
  );
}
