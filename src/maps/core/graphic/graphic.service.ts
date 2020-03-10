import { Injectable } from '@angular/core';

import { EsriTypesService } from '../esri-types/esri-types.service';

import { MarkerSymbolFactory } from './marker-symbol-factory/marker-symbol.factory';

@Injectable({
  providedIn: 'root'
})
export class GraphicService {
  private _markerSymbolFactory: MarkerSymbolFactory;

  constructor(private _esri: EsriTypesService) {
    this._markerSymbolFactory = new MarkerSymbolFactory(this._esri);
  }

  /**
   * Adds a new point graphic at given loation to the map/scene.
   */
  addNewGraphicToMap(point: __esri.Point, mapView: __esri.MapView | __esri.SceneView) {
    const markerGraphic = this._createPointGraphic(point);
    mapView.graphics.removeAll();
    mapView.graphics.add(markerGraphic);
  }

  /** @docs-private */
  private _createPointGraphic(geometryPoint: __esri.Point): __esri.Graphic {
    const point = this._createGeometryPoint(geometryPoint);

    const markerSymbol = this._markerSymbolFactory.createCircleSymbol();
    const graphicProperties: __esri.GraphicProperties = {
      geometry: point,
      symbol: markerSymbol
    };
    return new this._esri.Graphic(graphicProperties);
  }

  /** @docs-private */
  private _createGeometryPoint(geometry: any): __esri.Point {
    const pointProperties: __esri.PointProperties = {
      x: geometry.x,
      y: geometry.y,
      spatialReference: geometry.spatialReference
    };

    return new this._esri.Point(pointProperties);
  }
}
