import { readFileSync, writeFileSync } from 'fs';

if (require.main === module) {
  const [sourceFileManifest, outputFile] = process.argv.slice(2);
  const moduleIcons: { [module: string]: string[] } = {};
  readFileSync(sourceFileManifest, 'utf8')
    .split(' ')
    .map((filePath) => filePath.trim())
    .filter((s) => s.endsWith('.html'))
    .forEach((file) => {
      const moduleName = `@sbb-esta/${file.match(/src\/([\w-]+\/[\w-]+)/)![1]}`;
      const content = readFileSync(file, 'utf8');
      const detectedIcons = findIcons(content);
      if (!detectedIcons.length) {
        return;
      } else if (!(moduleName in moduleIcons)) {
        moduleIcons[moduleName] = [];
      }

      moduleIcons[moduleName].push(...detectedIcons);
    });

  const icons = Object.keys(moduleIcons).reduce(
    (collection, module) =>
      collection.concat({
        module,
        icons: moduleIcons[module].filter((v, i, a) => a.indexOf(v) === i).sort(),
      }),
    [] as { module: string; icons: string[] }[]
  );
  writeFileSync(outputFile, JSON.stringify(icons, null, 2), 'utf8');
}

function findIcons(content: string) {
  const svgIconRegex = /svgIcon="([^"]+)"/g;
  const icons: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = svgIconRegex.exec(content))) {
    icons.push(match[1]);
  }

  return icons;
}
