import node from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';

// @arcgis/core can cause terser errors (e.g. ERROR: "e" is redeclared).
// In order to avoid this, we rename problematic variables during bundling.
const replacements = [
  { include: 'node_modules/@arcgis/core/widgets/LayerList/support/layerListUtils.js', e: 'e_1' },
  { include: 'node_modules/@arcgis/core/support/actions/ActionSlider.js', r: 'r_1' },
  {
    include: 'node_modules/@arcgis/core/widgets/BasemapGallery/support/LocalBasemapsSource.js',
    a: 'a_1',
  },
];

export default {
  plugins: [
    ...replacements.map(({ include, ...values }) =>
      replace({ include, preventAssignment: false, values })
    ),
    alias({
      // Work-around for https://github.com/bazelbuild/rules_nodejs/issues/1380#issuecomment-558631283
      entries: ['business', 'core', 'icons', 'keycloak', 'maps', 'public'].map((pkg) => ({
        find: `@sbb-esta/angular-${pkg}`,
        replacement: `${__dirname}/../angular-${pkg}`,
      })),
    }),
    node({
      mainFields: ['es2015', 'module', 'browser', 'jsnext:main', 'main'],
      extensions: ['.mjs', '.js'],
    }),
    commonjs(),
  ],
};
