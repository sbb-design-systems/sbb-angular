/**
 * Add all required imports from @arcgis/core to this list and also to arcgis-core-bundle.js
 */

var arcgisCoreSymbols = {
  '@arcgis/core/geometry/Extent': 'Extent',
  '@arcgis/core/geometry/Point': 'Point',
  '@arcgis/core/Graphic': 'Graphic',
  '@arcgis/core/views/MapView': 'MapView',
  '@arcgis/core/WebMap': 'WebMap',
  '@arcgis/core/views/SceneView': 'SceneView',
  '@arcgis/core/symbols/SimpleMarkerSymbol': 'SimpleMarkerSymbol',
  '@arcgis/core/layers/FeatureLayer': 'FeatureLayer',
  '@arcgis/core/widgets/BasemapGallery': 'BasemapGallery',
  '@arcgis/core/config': 'esriConfig',
  '@arcgis/core/widgets/LayerList': 'LayerList',
  '@arcgis/core/widgets/Legend': 'Legend',
  '@arcgis/core/Camera': 'Camera',
  '@arcgis/core/WebScene': 'WebScene',
};

(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    Object.keys(arcgisCoreSymbols).forEach(function (importPath) {
      define(importPath, ['exports', 'module', 'arcgisCore'], factory);
    });
  }
})(function (exports, module, arcgisCore) {
  'use strict';
  const symbolName = arcgisCoreSymbols[module.id];
  exports.default = arcgisCore[symbolName];
  Object.defineProperty(exports, '__esModule', { value: true });
});
