import typescript from 'rollup-plugin-typescript2';
import { join } from 'path';

export default {
  input: join(__dirname, 'documentation/index.ts'),
  output: {
    file: join(__dirname, 'documentation/index.js'),
    format: 'cjs'
  },
  external: [
    '@angular-devkit/schematics',
    '@angular-devkit/core',
    'dgeni',
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
    'typescript'
  ],
  plugins: [
    typescript({
      tsconfig: join(__dirname, 'tsconfig.json'),
      //useTsconfigDeclarationDir: true,
      cacheRoot: `${require('os').tmpdir()}/.rpt2_cache_sbb_angular_schematics`
    })
  ]
};
