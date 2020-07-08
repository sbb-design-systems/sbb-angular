import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

if (require.main === module) {
  const [outputFile, baseDir] = process.argv.slice(2);

  const icons: { module: string; icons: string[] }[] = [];
  const packages = readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'showcase')
    .map((d) => join(baseDir, d.name));
  for (const pckg of packages) {
    const modules = readdirSync(pckg, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => join(pckg, d.name));
    for (const module of modules) {
      const moduleIcons = findHtmlFiles(module)
        .map((f) => readFileSync(f, 'utf8'))
        .map(findIcons)
        .reduce((current, next) => current.concat(next), [])
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      if (moduleIcons.length) {
        icons.push({
          module: `@sbb-esta/${basename(pckg)}/${basename(module)}`,
          icons: moduleIcons,
        });
      }
    }
  }

  writeFileSync(outputFile, JSON.stringify(icons, null, 2), 'utf8');
}

function findHtmlFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true })
    .map((d) => {
      if (d.isFile() && d.name.endsWith('.html')) {
        return [join(root, d.name)];
      } else if (d.isDirectory()) {
        return findHtmlFiles(join(root, d.name));
      } else {
        return [];
      }
    })
    .reduce((current, next) => current.concat(next), []);
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
