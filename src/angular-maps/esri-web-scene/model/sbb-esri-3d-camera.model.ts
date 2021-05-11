import Point from '@arcgis/core/geometry/Point';

export class SbbEsri3DCamera {
  fov?: number = 55;
  heading?: number = 0;
  position: Point;
  tilt?: number = 0;
}
