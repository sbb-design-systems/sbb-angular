# Accessing map data

Map interaction is a key part of any map driven application. Things like clicking, zooming and panning allow a diverse engagement with your data. `@sbb-esta/angular-maps` allows you to do everything with your map or 3D scene that can be done using the ArcGIS API for Javascript.

_You can find a complete overview of the API [here](https://developers.arcgis.com/javascript/latest/api-reference/)._

The following steps walk you trough a way to on how to access the data of the layers in your map and use the data in your application (and outside of the map).

## Sample: Access the underlaying data of a map

It's a common task to gain access the data of a map displayed by the WebMap component. For example, you could list that datain tabular form, create charts or just use single attribute values for extensive calculations or statistic.

### Step 0: Prerequisites

This sample relies on the sample _Layer filtering_. So it might be a goode idea to work tgrough this [Sample](/maps/advanced/layer-filtering) first.

### Step 1: Access the layer containing the desired data

Get your layer, just like we did in the previous sample.

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

_Note: The map does not load all data at once, but only data that is required to display the active map extent by default. Thus, you have to load the data again._

When you got the layer you want, you can _query_ it, using the `__esri.FeatureLayer`'s method `queryFeatures()`.

_Note: To query a FeatureLayer you need an [`__esri.Query`](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html) Object, which you can create using the `__esri.FeatureLayer`'s method `createQuery()`. You can define configure the query using the [`where()` property](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html#where) and other things. Just check out the ArcGIS Javascript Documentation._

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
    this.loadDataFromLayer();
  }

  private loadDataFromLayer() {
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

The `queryFeatures()` method returns an [`__esri.FeatureSet`](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-FeatureSet.html). The `__esri.FeatureSet` contains all the requested objects as [`__esri.Graphic[]`](https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html) and some other informations about the queried layer.
