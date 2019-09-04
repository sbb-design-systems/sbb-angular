const { copy, emptyDir, exists, mkdir, move, writeFile } = require('fs-extra');
const { join, resolve } = require('path');
const glob = require('glob');

(async () => {
  const libraryPath = resolve(__dirname, '../projects/sbb-esta/angular-business');
  const srcPath = join(libraryPath, 'src/lib');

  const dirs = glob.sync('*', { cwd: srcPath }).filter(d => !d.endsWith('_common'));
  for (const dir of dirs) {
    const sourceDir = join(srcPath, dir);
    const targetDir = join(libraryPath, dir);
    if (await exists(targetDir)) {
      await emptyDir(targetDir);
    } else {
      await mkdir(targetDir);
    }

    const srcDir = join(targetDir, 'src');
    await mkdir(srcDir);
    await copy(sourceDir, srcDir);
    if (await exists(join(srcDir, `${dir}.md`))) {
      await move(join(srcDir, `${dir}.md`), join(targetDir, `${dir}.md`));
    }
    await move(join(srcDir, `${dir}.ts`), join(srcDir, `public_api.ts`));
    await writeFile(
      join(targetDir, 'package.json'),
      JSON.stringify({ ngPackage: {} }, null, 2),
      'utf8'
    );
    await writeFile(join(targetDir, 'index.ts'), `export * from './src/public_api';\n`, 'utf8');
  }
  console.log(dirs);
})().catch(console.error);
