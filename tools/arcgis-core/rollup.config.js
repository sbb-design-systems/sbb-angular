import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

// This regex should match the map with the locale imports.
const arcgisMomentLocales = (readFileSync(
  require.resolve('@arcgis/core/intl/moment.js'),
  'utf8'
).match(/new Map\(\[(\[[^\]]+\],?)+\]\)/) || [])[0];
if (!arcgisMomentLocales) {
  throw new Error(
    `@arcgis/core moment.js loading changed. Please manually fix tools/arcgis-core/rollup.config.js!`
  );
}

export default {
  output: {
    amd: {
      id: 'arcgisCore',
    },
    name: 'arcgisCore',
    inlineDynamicImports: true,
  },
  plugins: [
    // For the devserver we remove the optional moment.js locales,
    // in order to reduce bundling effort and generated bundles.
    replace({
      include: 'node_modules/@arcgis/core/intl/moment.js',
      preventAssignment: false,
      delimiters: ['', ''],
      values: {
        [arcgisMomentLocales]: 'new Map()',
      },
    }),
    nodeResolve(),
    commonjs(),
  ],
};
