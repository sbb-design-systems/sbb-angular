const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const alias = require('@rollup/plugin-alias');

module.exports = {
  plugins: [
    alias({
      // Work-around for https://github.com/bazelbuild/rules_nodejs/issues/1380#issuecomment-558631283
      entries: [
        'angular',
        'angular-business',
        'angular-core',
        'angular-icons',
        'angular-keycloak',
        'angular-maps',
        'angular-public',
        'components-examples',
      ].map((pkg) => ({
        find: `@sbb-esta/${pkg}`,
        replacement: `${__dirname}/../${pkg}`,
      })),
    }),
    node({
      mainFields: ['es2015', 'module', 'browser', 'jsnext:main', 'main'],
      extensions: ['.mjs'],
    }),
    commonjs(),
  ],
};
