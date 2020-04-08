(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define('esri-loader', ['exports', 'rxjs'], factory);
  }
})(function(exports, rxjs) {
  'use strict';
  Object.keys(rxjs.operators).forEach(function(key) {
    exports[key] = rxjs.operators[key];
  });
  Object.defineProperty(exports, '__esModule', { value: true });
});
