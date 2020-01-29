# Map Interactions

## Introduction

A map gets much more interesting, when you can do more things than just clicking, zooming and panning around!
Because of this you are able to do everything with your map, what the ArcGIS Javascript API allows you to do.

> You can find a complete overview of the API [here](https://developers.arcgis.com/javascript/latest/api-reference/).

In the following steps we will go through an example, on how to use your map in a more complex way.

## Sample: Filter your map layers using definition expressions

You are able to filter layers on a map based on a sql query. This is called a [definition expression](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#definitionExpression).

### Step 0: Prerequisites

Setup the `@sbb-esta/angular-maps` as described in the [Getting started section](/maps/introduction/getting-started).

### Step 1: Setup a basic WebMap in your App

_app.component.html_

```html
<sbb-esri-web-map [portalItemId]="'f2e9b762544945f390ca4ac3671cfa72'"> </sbb-esri-web-map>
```

### Step 2: Access the map through the `(mapReady)` output

Listen to `(mapReady)` output, to get notified when the MapView is ready for usage.

> A [`MapView`](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html) represents a 2D Map in the ESRI universe.

_app.component.html_

```html
<sbb-esri-web-map [portalItemId]="'f2e9b762544945f390ca4ac3671cfa72'" (mapReady)="mapReady($event)">
</sbb-esri-web-map>
```

_app.component.ts_

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

### Step 3: Filter the layers using definition expressions

> _Note:_ You can find the docs at https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#definitionExpression

Now with having the mapview loaded, you are able to access it's layers:

> _Note:_ The map is ready, even if it's layer aren't at the moment! To get notified when a layer is ready you can use `mapview.on('layerview-create', e => { ... })`

_app.component.ts_

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

Now the map shows only the data with "Accidental Deaths per 100k" > 60!
