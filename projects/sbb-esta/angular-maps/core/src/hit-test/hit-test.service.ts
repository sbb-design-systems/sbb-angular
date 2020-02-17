import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HitTestService {
  /**
   * Calls the ESRI hitTest method for a location on a given map-/scene-view.
   */
  async esriHitTest(
    mapView: __esri.MapView | __esri.SceneView,
    mapClickEvent: __esri.MapViewClickEvent | __esri.SceneViewClickEvent
  ): Promise<__esri.Graphic[]> {
    const hitTestGraphics: __esri.Graphic[] = [];
    mapView.map.layers.forEach(l => {
      const featureLayer: __esri.FeatureLayer = l as __esri.FeatureLayer;
      featureLayer.outFields = ['*'];
    });
    const response: __esri.HitTestResult = await mapView.hitTest(mapClickEvent);
    response.results.forEach(result => {
      hitTestGraphics.push(result.graphic);
    });
    return hitTestGraphics;
  }
}
