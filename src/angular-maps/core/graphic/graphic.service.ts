import { Injectable } from '@angular/core';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';

import { SbbMarkerSymbolFactory } from './marker-symbol-factory/marker-symbol.factory';
import GraphicProperties = __esri.GraphicProperties;
import PointProperties = __esri.PointProperties;

@Injectable({
  providedIn: 'root',
})
export class SbbGraphicService {
  private _markerSymbolFactory: SbbMarkerSymbolFactory;

  constructor() {
    this._markerSymbolFactory = new SbbMarkerSymbolFactory();
  }

  /** Adds a new point graphic at given loation to the map/scene. */
  addNewGraphicToMap(point: Point, mapView: MapView | SceneView) {
    const markerGraphic = this._createPointGraphic(point);
    mapView.graphics.removeAll();
    mapView.graphics.add(markerGraphic);
  }

  /** @docs-private */
  private _createPointGraphic(geometryPoint: Point): Graphic {
    const point = this._createGeometryPoint(geometryPoint);

    const markerSymbol = this._markerSymbolFactory.createCircleSymbol();
    const graphicProperties: GraphicProperties = {
      geometry: point,
      symbol: markerSymbol,
    };
    return new Graphic(graphicProperties);
  }

  /** @docs-private */
  private _createGeometryPoint(geometry: any): Point {
    const pointProperties: PointProperties = {
      x: geometry.x,
      y: geometry.y,
      spatialReference: geometry.spatialReference,
    };

    return new Point(pointProperties);
  }
}
