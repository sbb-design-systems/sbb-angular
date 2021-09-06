import { Injectable } from '@angular/core';
import ViewClickEvent = __esri.ViewClickEvent;
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import HitTestResult = __esri.HitTestResult;

@Injectable({
  providedIn: 'root',
})
export class SbbHitTestService {
  /** Calls the ESRI hitTest method for a location on a given map-/scene-view. */
  esriHitTest(mapView: MapView | SceneView, mapClickEvent: ViewClickEvent): Promise<Graphic[]> {
    mapView.map.layers.forEach((l) => ((l as FeatureLayer).outFields = ['*']));
    return mapView
      .hitTest(mapClickEvent)
      .then((response: HitTestResult) => response.results.map((r) => r.graphic));
  }
}
