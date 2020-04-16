const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const alias = require('@rollup/plugin-alias');
const replace = require('@rollup/plugin-replace');

module.exports = {
  plugins: [
    alias({
      // Work-around for https://github.com/bazelbuild/rules_nodejs/issues/1380#issuecomment-558631283
      entries: ['business', 'core', 'icons', 'keycloak', 'maps', 'public'].map(pkg => ({
        find: `@sbb-esta/angular-${pkg}`,
        replacement: `${__dirname}/../${pkg}`
      }))
    }),
    replace({
      patterns: [
        {
          // Work-around for the generated Angular ViewEngine ngfactory imports that
          // starts with `sbb_angular/external/npm/node_modules/`.
          match: /\.ngfactory\.mjs/,
          test: 'sbb_angular/external/npm/node_modules/',
          replace: ''
        }
      ]
    }),
    node({
      mainFields: ['es2015', 'module', 'browser', 'jsnext:main', 'main']
    }),
    commonjs()
  ]
};
