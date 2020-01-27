The legend component shows and describes the symbology of layers and features in a web map or 3d scene.

_Note: In order to work, the legend component depends on a [MapView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html) or on a [SceneView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html). You can get the MapView/SceneView from the `sbb-esri-web-map` or `sbb-esri-web-scene` component using Element Reference._

### Legend for WebMaps

Here's a simple example of how to use the legend component in code, together with a web map.

_my-map-with-legend.component.html_:

```html
<sbb-esri-web-map [portalItem]="'e691172598f04ea8881cd2a4adaa45ba'" #webMap></sbb-esri-web-map>

<sbb-esri-legend [mapView]="webMap.mapView"></sbb-esri-legend>
```

### Legend for WebScenes

Here's a simple example of how to use the legend component in code, together with a web scene.

_my-scene-with-legend.component.html_:

```html
<sbb-esri-web-scene
  [portalItem]="'e691172598f04ea8881cd2a4adaa45ba'"
  #webScene
></sbb-esri-web-scene>

<sbb-esri-legend [mapView]="webScene.sceneView"></sbb-esri-legend>
```

### Styling the legend

It's possible to apply a style to the legend (type and layout, for example card type with a stacked layout). Available style settings are described at <https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Legend.html#style.>

The following example uses the _card_ type and provides a responsive layout, automatically chosing between _side-by-side_ and _stack_.

_my-map-with-legend.component.html_:

```html
<sbb-esri-web-map [portalItem]="'affa021c51944b5694132b2d61fe1057'" #webMap></sbb-esri-web-map>

<sbb-esri-legend [mapView]="webMap.mapView" [style]="{'card', 'auto'}"></sbb-esri-legend>
```
