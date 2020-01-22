The basemap-gallery shows a list of all available basemaps.

> _Note:_ In order to work, the basemap-gallery depends on a [MapView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html) or on a [SceneView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html).  
> You can get the MapView/SceneView from the `<sbb-esri-web-map></sbb-esri-web-map>` / `<sbb-esri-web-scene></sbb-esri-web-scene>` component using Element Reference.

### Basemap-gallery for WebMaps

_my-map-with-layerlist.component.html_

```html
<sbb-esri-web-map [portalItem]="'e691172598f04ea8881cd2a4adaa45ba'" #webMap></sbb-esri-web-map>

<sbb-esri-basemap-gallery [mapView]="webMap.mapView"></sbb-esri-basemap-gallery>
```

### Basemap-gallery for WebScenes

_my-scene-with-layerlist.component.html_

```html
<sbb-esri-web-scene
  [portalItem]="'affa021c51944b5694132b2d61fe1057'"
  #webScene
></sbb-esri-web-scene>

<sbb-esri-basemap-gallery [mapView]="webScene.sceneView"></sbb-esri-basemap-gallery>
```
