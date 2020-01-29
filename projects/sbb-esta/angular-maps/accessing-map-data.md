# Accessing map data

## Introduction

A map gets much more interesting, when you can do more things than just clicking, zooming and panning around!
Because of this you are able to do everything with your map, what the ArcGIS Javascript API allows you to do.

> You can find a complete overview of the API [here](https://developers.arcgis.com/javascript/latest/api-reference/).

In the following steps we will go through an example, on how to use your map in a more complex way.

## Sample: Access the underlaying data of a map

In some cases you want to access the data displayed on the map. For example you could list that data in a tabular form, create a chart or whatever you want!

### Step 0: Prerequisites

This sample relies on the sample "Layer filtering". So it might be clever to check out this [Sample](/maps/advanced/layer-filtering) first!

### Step 1: Get the layer of which contains the data you want

Get your layer, like we did it in the sample before:

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
    this.()
  }

  private putMyMapFilterOn() {
    this.mapView.on('layerview-create', async event => {
      const { layer } = event;
      if (layer.id === 'Accidental_Deaths_8938') {
        const featureLayer = layer as __esri.FeatureLayer;
      }
    });
  }
}
```

### Step 2: Get all the data using the `featureLayer.queryFeatures`

> _Note:_ Because the map does not load all data at a time, but only the ones in the active map section, you have to load the data again.

When you got the layer you want, you can query it, using the `__esri.FeatureLayer`'s method `queryFeatures()`.

> _Note:_ To query a FeatureLayer you need an [`__esri.Query`](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html) Object, which you can create using the `__esri.FeatureLayer`'s method `createQuery()`.
> You can define configure the query using the [`where()` property](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html#where) and other things. Just check out the ArcGIS Javascript Documentation.

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
    this.()
  }

  private putMyMapFilterOn() {
    this.mapView.on('layerview-create', async event => {
      const { layer } = event;
      if (layer.id === 'Accidental_Deaths_8938') {
        const featureLayer = layer as __esri.FeatureLayer;
        const q = featureLayer.createQuery();
        const featureSet = await featureLayer.queryFeatures(q);
      }
    });
  }
}
```
