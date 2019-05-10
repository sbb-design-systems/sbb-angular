import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy-glob';
import { join } from 'path';

export default {
  input: join(__dirname, 'schematics/generate-icon-modules/index.ts'),
  output: [
    {
      file: join(__dirname, 'schematics/generate-icon-modules/index.js'),
      format: 'cjs'
    },
    {
      file: join(
        __dirname,
        '../../../dist/sbb-esta/angular-icons/schematics/generate-icon-modules/index.js'
      ),
      format: 'cjs'
    }
  ],
  external: [
    '@angular-devkit/schematics',
    '@angular-devkit/core',
    'rxjs',
    'rxjs/operators'
  ],
  plugins: [
    typescript({
      tsconfig: join(__dirname, 'tsconfig.schematics.json'),
      cacheRoot: `${require('os').tmpdir()}/.rpt2_cache_seai_schematics`
    }),
    copy([
      {
        files: join(__dirname, 'schematics/generate-icon-modules/files/**/*.*'),
        dest: join(
          __dirname,
          '../../../dist/sbb-esta/angular-icons/schematics/generate-icon-modules/files'
        )
      }
    ])
  ]
};
