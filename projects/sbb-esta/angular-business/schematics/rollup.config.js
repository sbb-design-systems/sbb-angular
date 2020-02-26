import ts from '@wessberg/rollup-plugin-ts';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import copy from 'rollup-plugin-copy';

const dist = join(__dirname, '../../../../dist/sbb-esta/angular-public/schematics');
export default readdirSync(__dirname, { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(__dirname, d.name, 'index.ts')))
  .map(d => ({
    input: join(__dirname, d.name, 'index.ts'),
    output: {
      file: join(dist, d.name, 'index.js'),
      format: 'cjs'
    },
    external: ['@angular-devkit/schematics', '@angular-devkit/schematics/tasks'],
    plugins: [
      ts({
        browserslist: false,
        tsconfig: join(__dirname, './tsconfig.json')
      }),
      copy({
        absolute: true,
        targets: [
          { src: 'migration.json', dest: dist, cwd: __dirname },
          { src: 'files', dest: join(dist, d.name), cwd: join(__dirname, d.name) },
          { src: '*.json', dest: join(dist, d.name), cwd: join(__dirname, d.name) }
        ]
      })
    ]
  }));
