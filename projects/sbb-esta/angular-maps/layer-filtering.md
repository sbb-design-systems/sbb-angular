# Layer filtering

Map interaction is a key part of any map driven application. Things like clicking, zooming and panning allow a diverse engagement with your data. `@sbb-esta/angular-maps` allows you to do everything with your map or 3D scene that can be done using the ArcGIS API for Javascript.

_You can find a complete overview of the API [here](https://developers.arcgis.com/javascript/latest/api-reference/)._

The following steps walk you trough a way to on how to dynamically show or hide certain the contents of your map.

## Sample: Filter your map layers using definition expressions

Layers can be filtered based on expressions using a simple SQL syntax. This query is called [definition expression](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#definitionExpression).

### Step 0: Prerequisites

Setup the `@sbb-esta/angular-maps` as described in the [Getting started section](/maps/introduction/getting-started).

### Step 1: Setup a basic WebMap in your App

_app.component.html_:

```html
<sbb-esri-web-map [portalItemId]="'f2e9b762544945f390ca4ac3671cfa72'"> </sbb-esri-web-map>
```

### Step 2: Access the map through the `(mapReady)` output

Listen to `(mapReady)` output to get notified when the MapView (as provided by the WebMap component) is ready for usage.

> _In the ArcGIS universe, a [`MapView`](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html) represents a 2D map._

_app.component.html_:

```html
<sbb-esri-web-map [portalItemId]="'f2e9b762544945f390ca4ac3671cfa72'" (mapReady)="mapReady($event)">
</sbb-esri-web-map>
```

_app.component.ts_:

```ts
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public mapView: __esri.MapView;

  mapReady(mv: __esri.MapView) {
    this.mapView = mv;
  }
}
```

### Step 3: Filter layers using definition expressions

_Note: You can find the docs at <https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#definitionExpression>_

Now with having the MapView loaded, you are able to access it's layers:

_app.component.ts_:

```ts
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public mapView: __esri.MapView;

  mapReady(mv: __esri.MapView) {
    this.mapView = mv;
    this.putMyMapFilterOn();
  }

  private putMyMapFilterOn() {
    this.mapView.on('layerview-create', event => {
      const { layer } = event;
      if (layer.id === 'Accidental_Deaths_8938') {
        const featureLayer = layer as __esri.FeatureLayer;
        featureLayer.definitionExpression = 'U_C_Rate > 60';
      }
    });
  }
}
```

The map now only shows data where "Accidental Deaths per 100k" > 60.

\_Note: You will possibly get notified that the map is ready, even if the map's layers are not ready set. To get notified once a certain layer is ready, you can use `mapview.on('layerview-create', e => { ... })`.
