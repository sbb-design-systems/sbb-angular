// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SbbHitTestService {
  /** Calls the ESRI hitTest method for a location on a given map-/scene-view. */
  esriHitTest(
    mapView: __esri.MapView | __esri.SceneView,
    mapClickEvent: __esri.MapViewClickEvent | __esri.SceneViewClickEvent
  ): Promise<__esri.Graphic[]> {
    mapView.map.layers.forEach((l) => ((l as __esri.FeatureLayer).outFields = ['*']));
    return mapView
      .hitTest(mapClickEvent)
      .then((response: __esri.HitTestResult) => response.results.map((r) => r.graphic));
  }
}
