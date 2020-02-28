# Loading ArcGIS API Types

The ArcGIS API for Javascript depends on the [Esri/esri-loader](https://github.com/Esri/esri-loader) in order to load the API. A basic setup with the _esri-loader_ in Angular Apps can be found [here](https://developers.arcgis.com/javascript/latest/guide/angular/).

_Note: Angular uses rollup.js instead of Webpack to bundle libraries. Thus it's not currently possible to use [@arcgis/webpack-plugin](https://www.npmjs.com/package/@arcgis/webpack-plugin).._

### EsriLoaderService

As a simplification to the rather complicated setup and usage of _esri-loader_, the `@sbb-esta/angular-maps` package provides `EsriLoaderService`. The service is a wrapper for _esri-loader_ and makes it easier to load further modules from the ArcGIS API for Javascript.

#### When to use EsriLoaderService

Use the `@sbb-esta/angular-maps/esri-loader.service` to instantiate [types from the ArcGIS API for Javascript](https://developers.arcgis.com/javascript/latest/api-reference/).

_Note: You can also instantiate a simple type using Typescript's type assertions:_

> ```ts
> let myPoint = { x 0, y: 0, z : 0 } as __esri.Point
> ```

### Step 0: Prerequisites

Setup the `@sbb-esta/angular-maps` as described in [Getting started section](/maps/introduction/getting-started).

### Step 1: Import `EsriConfigModule` (in case you haven't done so already)

`EsriConfigModule` provides the `EsriLoaderService`.

_app.module.ts_:

```ts
import { EsriConfigModule } from '@sbb-esta/angular-maps';

@NgModule({
  ...
  imports: [EsriConfigModule],
  ...
})
export class AppModule { }
```

### Step 2: Create an `esri-types.service.ts`

In this example, we will load the types for [`esri/geometry/Point`](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html) and for [`esri/Graphic`](https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html).

The best way to load more parts of the ArcGIS API for Javascript is to encapsulate the functionality in a service.

Create a service using Angular CLI `ng g s path/to/esri-types.service.ts`, and replace its contents with:

_esri-types.service.ts_:

```ts
import { Injectable } from '@angular/core';

import { EsriLoaderService } from '@sbb-esta/angular-maps';

@Injectable({
  providedIn: 'root'
})
export class EsriTypesService {
  private _point: __esri.PointConstructor;
  private _graphic: __esri.GraphicConstructor;

  get Point(): __esri.PointConstructor {
    return this._point;
  }

  get Graphic(): __esri.GraphicConstructor {
    return this._graphic;
  }

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._point) {
      // do not load the types if they're already loaded.
      [this._point, this.graphic] = await this._loader.load<
        __esri.PointConstructor,
        __esri.GraphicConstructor
      >(['esri/geometry/Point', 'esri/Graphic']);
    }
  }
}
```

_Note: To load more types, just add them to the `load` method. Please refer to the [ArcGIS Javascript API reference](https://developers.arcgis.com/javascript/latest/api-reference/) for all available types._

### Step 3: Use your new service to load the types

You are now ready to consume the types in your components or services:

_my-sample.component.ts_:

```ts
import { EsriTypesService } from './path/to/esri-types.service';

@Component({
  selector: 'app-my-sample',
  templateUrl: './my-sample.component.html',
  styleUrls: ['./my-sample.component.scss']
})
export class MySampleComponent implements OnInit {
  point: __esri.Point;
  graphic: __esri.Graphic;

  constructor(private _esri: EsriTypesService) {}

  async ngOnInit() {
    await this._esri.load();
    this.point = new this._esri.Point();
    this.graphic = new this._esri.Graphic();
  }
}
```
