import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const replacements = [
  { include: 'node_modules/@arcgis/core/support/webSceneUtils.js', o: 'o_1' },
  {
    include: 'node_modules/@arcgis/core/views/3d/glTF/internal/fillDefaults.js',
    a: 'a_1',
    s: 's_1',
  },
  { include: 'node_modules/@arcgis/core/views/3d/webgl-engine/lib/DDSUtil.js', a: 'a_2' },
  { include: 'node_modules/@arcgis/core/views/3d/webgl-engine/lib/BasisUtil.js', a: 'a_3' },
];

export default {
  // preserveEntrySignatures is disabled due to caching issues,
  // as index.js would be cached in the browser.
  // preserveEntrySignatures: false,
  plugins: [
    ...replacements.map(({ include, ...values }) =>
      replace({ include, preventAssignment: false, values })
    ),
    dynamicImportVars({
      exclude: [
        'node_modules/@arcgis/core/core/workers/workers.js',
        'node_modules/@arcgis/core/core/workers/WorkerFallback.js',
      ],
    }),
    nodeResolve({
      mainFields: ['es2015', 'module', 'browser', 'jsnext:main', 'main'],
      extensions: ['.mjs', '.js'],
    }),
    commonjs(),
  ],
};
