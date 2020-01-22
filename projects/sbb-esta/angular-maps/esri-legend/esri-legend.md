The legend shows a list of symbols and what their representing on the map.

> _Note:_ In order to work, the legend depends on a [MapView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html) or on a [SceneView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html).  
> You can get the MapView/SceneView from the `<sbb-esri-web-map></sbb-esri-web-map>` / `<sbb-esri-web-scene></sbb-esri-web-scene>` component using Element Reference.

### Legend for WebMaps

_my-map-with-layerlist.component.html_

```html
<sbb-esri-web-map [portalItem]="'e691172598f04ea8881cd2a4adaa45ba'" #webMap></sbb-esri-web-map>

<sbb-esri-legend [mapView]="webMap.mapView"></sbb-esri-legend>
```

### Legend for WebScenes

_my-scene-with-layerlist.component.html_

```html
<sbb-esri-web-scene
  [portalItem]="'e691172598f04ea8881cd2a4adaa45ba'"
  #webScene
></sbb-esri-web-scene>

<sbb-esri-legend [mapView]="webScene.sceneView"></sbb-esri-legend>
```

### Styling the legend

You are able to style the legend. Use the settings from https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Legend.html#style.

_my-map-with-layerlist.component.html_

```html
<sbb-esri-web-map [portalItem]="'affa021c51944b5694132b2d61fe1057'" #webMap></sbb-esri-web-map>

<sbb-esri-legend [mapView]="webMap.mapView" [style]="{'card', 'auto'}"></sbb-esri-legend>
```
