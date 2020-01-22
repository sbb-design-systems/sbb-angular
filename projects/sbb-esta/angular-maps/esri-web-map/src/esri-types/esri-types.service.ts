import { Injectable } from '@angular/core';

import { EsriLoaderService } from '../../../esri-config/src/esri-loader.service';

@Injectable()
export class EsriTypesService {
  private _webMap: __esri.WebMapConstructor;
  private _mapView: __esri.MapViewConstructor;
  private _extent: __esri.ExtentConstructor;

  // tslint:disable-next-line: naming-convention
  get WebMap(): __esri.WebMapConstructor {
    return this._webMap;
  }

  // tslint:disable-next-line: naming-convention
  get MapView(): __esri.MapViewConstructor {
    return this._mapView;
  }

  // tslint:disable-next-line: naming-convention
  get Extent(): __esri.ExtentConstructor {
    return this._extent;
  }

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._webMap) {
      [this._webMap, this._mapView, this._extent] = await this._loader.load<
        __esri.WebMapConstructor,
        __esri.MapViewConstructor,
        __esri.ExtentConstructor
      >(['esri/WebMap', 'esri/views/MapView', 'esri/geometry/Extent']);
    }
  }
}
