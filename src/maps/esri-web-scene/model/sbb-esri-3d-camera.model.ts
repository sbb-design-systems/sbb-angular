// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

export class SBBEsri3DCamera {
  fov?: number = 55;
  heading?: number = 0;
  position: __esri.Point;
  tilt?: number = 0;
}
