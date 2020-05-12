const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const alias = require('@rollup/plugin-alias');

module.exports = {
  plugins: [
    alias({
      // Work-around for https://github.com/bazelbuild/rules_nodejs/issues/1380#issuecomment-558631283
      entries: ['business', 'core', 'icons', 'keycloak', 'leaflet', 'maps', 'public'].map(pkg => ({
        find: `@sbb-esta/angular-${pkg}`,
        replacement: `${__dirname}/../angular-${pkg}`
      }))
    }),
    node({
      mainFields: ['es2015', 'module', 'browser', 'jsnext:main', 'main'],
      extensions: ['.mjs']
    }),
    commonjs()
  ]
};
