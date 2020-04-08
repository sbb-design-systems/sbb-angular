const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  plugins: [
    node({
      mainFields: ['es2015', 'module', 'browser', 'jsnext:main', 'main']
    }),
    commonjs()
  ]
};
