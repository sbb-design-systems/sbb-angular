import ts from '@wessberg/rollup-plugin-ts';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

export default readdirSync(__dirname, { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(__dirname, d.name, 'index.ts')))
  .map(d => ({
    input: join(__dirname, d.name, 'index.ts'),
    output: {
      file: join(__dirname, d.name, 'index.js'),
      format: 'cjs'
    },
    external: [
      '@angular/cdk/schematics',
      '@angular-devkit/schematics',
      '@angular-devkit/core',
      '@angular-devkit/core/src/utils/strings',
      '@schematics/angular/utility/ast-utils',
      '@schematics/angular/utility/config',
      'dgeni',
      'dgeni-packages/typescript/api-doc-types/ApiDoc',
      'dgeni-packages/typescript/api-doc-types/ClassExportDoc',
      'dgeni-packages/typescript/api-doc-types/ExportDoc',
      'dgeni-packages/typescript/api-doc-types/MemberDoc',
      'dgeni-packages/typescript/api-doc-types/MethodMemberDoc',
      'dgeni-packages/typescript/api-doc-types/PropertyMemberDoc',
      'fs',
      'highlight.js',
      'html-minifier',
      'marked',
      'path',
      'rxjs',
      'rxjs/operators',
      'svgo',
      'typescript'
    ],
    plugins: [
      ts({
        browserslist: false,
        tsconfig: join(__dirname, 'tsconfig.json')
      })
    ]
  }));
