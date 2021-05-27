// Registers all available @arcgis/core symbols in require.js.
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    Object.keys(arcgis.core.default).forEach(function (importPath) {
      define(importPath, ['exports', 'module'], factory);
    });
  }
})(function (exports, module) {
  'use strict';
  exports.default = arcgis.core.default[module.id];
  Object.defineProperty(exports, '__esModule', { value: true });
});
