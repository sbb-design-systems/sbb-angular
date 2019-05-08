import typescript from 'rollup-plugin-typescript2';

export default {
  input: './schematics/generate-icon-modules/index.ts',
  output: {
    file: './schematics/generate-icon-modules/index.js',
    format: 'cjs'
  },
  external: [
    '@angular-devkit/schematics',
    '@angular-devkit/core',
    'rxjs',
    'rxjs/operators'
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.schematics.json',
      cacheRoot: `${require('os').tmpdir()}/.rpt2_cache_seai_schematics`
    })
  ]
};
