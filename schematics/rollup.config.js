import typescript from 'rollup-plugin-typescript2';
import { join } from 'path';

export default [
  'documentation',
  'example-migration',
  'generate-icon-modules',
  'public2business'
].map(directory => ({
  input: join(__dirname, directory, 'index.ts'),
  output: {
    file: join(__dirname, directory, 'index.js'),
    format: 'cjs'
  },
  external: [
    '@angular-devkit/schematics',
    '@angular-devkit/core',
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
    'typescript'
  ],
  plugins: [
    typescript({
      tsconfig: join(__dirname, 'tsconfig.json'),
      //useTsconfigDeclarationDir: true,
      cacheRoot: `${require('os').tmpdir()}/.rpt2_csas_${directory}`
    })
  ]
}));
