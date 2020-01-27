# EsriLoaderService

## Introduction

The ArcGIS Javascript API depends on the [Esri/esri-loader](https://github.com/Esri/esri-loader) in order to load the API. A basic setup with the esri-loader in Angular Apps can be found [here](https://developers.arcgis.com/javascript/latest/guide/angular/).

> _Note:_ Because Angular uses rollup.js and not Webpack to bundle a library, it is not possible to use [@arcgis/webpack-plugin](https://www.npmjs.com/package/@arcgis/webpack-plugin).

## EsriLoaderService

Because it is not that simple to setup and use the esri-loader, the `@sbb-esta/angular-maps`-package offers the `EsriLoaderService`. The `EsriLoaderService` is a wrapper for the esri-loader and makes it easier to load further modules from the ArcGIS JS API.

### In which use cases do I need it?

If you want to instantiate any [types from the `ArcGIS Javascript API`](https://developers.arcgis.com/javascript/latest/api-reference/), you have to use the esri-loader or the `@sbb-esta/angular-maps/esri-loader.service`.

> _Note:_ You can instantiate a simple type using typescripts type assertions as well:
>
> ```ts
> let myPoint = { x 0, y: 0, z : 0 } as __esri.Point
> ```

## Step 0: Prerequisites

Setup the `@sbb-esta/angular-maps` as it is described in the [Getting started section](/maps/introduction/getting-started).

## Step 1: Import the `EsriConfigModule` (in case you haven't already)

The `EsriConfigModule` offers the `EsriLoaderService`.

_app.module.ts_

```ts
import { EsriConfigModule } from '@sbb-esta/angular-maps';

@NgModule({
  ...
  imports: [EsriConfigModule],
  ...
})
export class AppModule { }
```

## Step 2: Create an `esri-types.service.ts`

In this example, we will load the types for [`esri/geometry/Point`](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html) and for [`esri/Graphic`](https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html).

The best way to load further parts of the ArcGIS javascript API is by capsule the functionality in a service.

Create a service using Angular CLI `ng g s path/to/esri-types.service.ts`, and replace its content with:

_esri-types.service.ts_

```ts
import { Injectable } from '@angular/core';

import { EsriLoaderService } from '@sbb-esta/angular-maps';

@Injectable({
  providedIn: 'root'
})
export class EsriTypesService {
  private _point: __esri.PointConstructor;
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

> _Note:_ To load more types, just add them to the `load` method.  
> You can find all available types in the [ArcGIS Javascript API reference](https://developers.arcgis.com/javascript/latest/api-reference/).

## Step 3: Use your new service to load the types

After setting up the listed things, you are ready to consume the types in your components or services:

_my-sample.component.ts_

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
