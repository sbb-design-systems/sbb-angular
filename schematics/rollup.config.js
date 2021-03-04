import ts from '@rollup/plugin-typescript';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export default readdirSync(__dirname, { withFileTypes: true })
  .filter(isBuildable)
  .map((d) => ({
    input: join(__dirname, d.name, 'index.ts'),
    output: {
      file: join(__dirname, d.name, 'index.js'),
      format: 'cjs',
    },
    external: [
      '@angular/cdk/schematics',
      '@angular-devkit/schematics',
      '@angular-devkit/schematics/tasks',
      '@angular-devkit/core',
      '@angular-devkit/core/src/utils/strings',
      '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript',
      '@schematics/angular/utility/ast-utils',
      '@schematics/angular/utility/config',
      '@schematics/angular/utility/workspace-models',
      'child_process',
      'crypto',
      'dgeni',
      'dgeni-packages/typescript/api-doc-types/ApiDoc',
      'dgeni-packages/typescript/api-doc-types/ClassExportDoc',
      'dgeni-packages/typescript/api-doc-types/ExportDoc',
      'dgeni-packages/typescript/api-doc-types/MemberDoc',
      'dgeni-packages/typescript/api-doc-types/MethodMemberDoc',
      'dgeni-packages/typescript/api-doc-types/PropertyMemberDoc',
      'fs',
      'highlight.js',
      'marked',
      'os',
      'path',
      'rxjs',
      'rxjs/operators',
      'svgo',
      'typescript',
    ],
    plugins: [
      ts({
        tsconfig: join(__dirname, 'tsconfig.json'),
      }),
      {
        name: 'eol-normalizer',
        renderChunk: (code) => code.replace(/\r\n/g, '\n'),
      },
    ],
  }));

function isBuildable(d) {
  if (!d.isDirectory()) {
    return false;
  }
  const dir = join(__dirname, d.name);
  const indexTs = join(dir, 'index.ts');
  const indexJs = join(dir, 'index.js');
  const lastModified = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.ts'))
    .map((d) => statSync(join(dir, d.name)).mtimeMs)
    .reduce((x, y) => Math.max(x, y), 0);
  return existsSync(indexTs) && (!existsSync(indexJs) || lastModified > statSync(indexJs).mtimeMs);
}
