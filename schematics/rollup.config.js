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
    'highlight.js',
    'marked',
    'rxjs',
    'rxjs/operators'
  ],
  plugins: [
    typescript({
      tsconfig: join(__dirname, 'tsconfig.json'),
      //useTsconfigDeclarationDir: true,
      cacheRoot: `${require('os').tmpdir()}/.rpt2_cache_sbb_angular_schematics`
    })
  ]
};
