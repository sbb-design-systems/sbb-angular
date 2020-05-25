# Access ArcGIS-services

In order to access geo services hosted on ArcGIS Online or on an on premise ArcGIS Enterprise installation (such as the SBB G-Sharp services and Geoportal) with Leaflet, you can use the [`esri-leaflet`](https://esri.github.io/esri-leaflet/) npm package.

### Step 0: Prerequisites

Setup `@sbb-esta/angular-maps-leaflet` as described in [Getting started](leaflet/introduction/getting-started).

You can now create your project as described in the official [Angular CLI documentation](https://cli.angular.io/).

### Step 1: Install `esri-leaflet`

Install the `@types/esri-leaflet` and `esri-leaflet` packages.

```sh
npm install --save @types/esri-leaflet esri-leaflet
```

or, if using yarn:

```sh
yarn add @types/esri-leaflet esri-leaflet
```

### Step 2: Add the typings to your tsconfig.json

```json
{
  ...
  "compilerOptions": {
    ...
    "types": [..., "esri-leaflet", "leaflet", ...],
    ...
  }
  ...
}
```

### Step 3: Use `esri-leaflet` to add a featurelayer to your leaflet-map

The following sample shows how to add a feature-service hosted on ArcGIS online.

```ts
import { Component, ViewChild } from '@angular/core';
import { LeafletMapComponent } from '@sbb-esta/angular-maps-leaflet/leaflet-map';
import { featureLayer } from 'esri-leaflet';

@Component({
  selector: 'my-leaflet-sample',
  templateUrl: './my-leaflet-sample.component.html',
  styleUrls: ['./my-leaflet-sample.component.scss']
})
export class MyLeafletSampleComponent {
  private _map: L.Map;
  private _myPointLayerGroup: LayerGroup<any>;
  @ViewChild('leafletMap', { static: true })
  private leafLetMap: LeafletMapComponent;

  public options = mapOptions;
  public lc = layersControlConfig;

  public mapReady(map: L.Map) {
    this._map = map;
  }

  public addLayerToMap() {
    const fl = featureLayer({
      url:
        'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Hazards_Uptown_Charlotte/FeatureServer/0'
    });
    this._myPointLayerGroup = this._createLayerGroup(myPoints);
    this.leafLetMap.addOverlayToMap({
      title: 'ArcGIS Online layer',
      layer: fl,
      visible: true
    });
  }
}
```

_Note: If you want to use services from G-Sharp (the SBB on premise installation of ArcGIS Enterprise), don't forget to add the properties `useCors=false` and `isModern=false` to the `featureLayer()` method. This is unfortunate but required until Esri fixes bug BUG-000130672._

_Note 2: For layers with many features (5000+) consider to use `renderer=new L.Canvas()` to gain performance. You can get more information about renderers in leaflet [here](https://esri.github.io/esri-leaflet/api-reference/layers/feature-layer.html)._
