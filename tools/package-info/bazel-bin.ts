import { readFileSync, writeFileSync } from 'fs';

if (require.main === module) {
  const [outputFile] = process.argv.slice(2);
  const packageJson = JSON.parse(readFileSync('../../package.json', 'utf8'));
  const angularVersion = readFileSync('../../pnpm-workspace.yaml', 'utf8').match(
    /@angular\/core'?: ?([\w\.-]+)/,
  )?.[1];
  writeFileSync(
    outputFile,
    `/** THIS FILE IS AUTO-GENERATED! DO NOT MODIFY! */
export const angularVersion = '${angularVersion}';
export const libraryVersion = '${packageJson.version}';`,
    'utf8',
  );
}
