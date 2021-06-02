/**
 * Add all required imports from @arcgis/core to this list and also to rollup-globals.bzl.
 */

import Camera from '@arcgis/core/Camera';
import esriConfig from '@arcgis/core/config';
import Extent from '@arcgis/core/geometry/Extent';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';

export default {
  '@arcgis/core/Camera': Camera,
  '@arcgis/core/config': esriConfig,
  '@arcgis/core/geometry/Extent': Extent,
  '@arcgis/core/geometry/Point': Point,
  '@arcgis/core/Graphic': Graphic,
  '@arcgis/core/layers/FeatureLayer': FeatureLayer,
  '@arcgis/core/symbols/SimpleMarkerSymbol': SimpleMarkerSymbol,
  '@arcgis/core/views/MapView': MapView,
  '@arcgis/core/views/SceneView': SceneView,
  '@arcgis/core/WebMap': WebMap,
  '@arcgis/core/WebScene': WebScene,
  '@arcgis/core/widgets/BasemapGallery': BasemapGallery,
  '@arcgis/core/widgets/LayerList': LayerList,
  '@arcgis/core/widgets/Legend': Legend,
};
