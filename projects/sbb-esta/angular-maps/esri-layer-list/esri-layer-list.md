The layer list shows a list of all layers of a map or 3d scene.

_Note: In order to work, the layer list component depends on a [MapView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html) or on a [SceneView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html). You can get the MapView/SceneView from the `sbb-esri-web-map` or `sbb-esri-web-scene` component using Element Reference._

### Layer list for WebMaps

Here's a simple example of how to use the layer list in code, together with a web map.

_my-map-with-layerlist.component.html_:

```html
<sbb-esri-web-map [portalItem]="'e691172598f04ea8881cd2a4adaa45ba'" #webMap></sbb-esri-web-map>

<sbb-esri-layer-list [mapView]="webMap.mapView"></sbb-esri-layer-list>
```

### Layer list for WebScenes

Here's a simple example of how to use the layer list in code, together with a web scene.

_my-scene-with-layerlist.component.html_:

```html
<sbb-esri-web-scene
  [portalItem]="'affa021c51944b5694132b2d61fe1057'"
  #webScene
></sbb-esri-web-scene>

<sbb-esri-layer-list [mapView]="webScene.sceneView"></sbb-esri-layer-list>
```
