import { Injectable } from '@angular/core';

import { EsriLoaderService } from '../../../esri-config/src/esri-loader.service';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule
})
export class EsriTypesService {
  private _point: __esri.PointConstructor;
  private _graphic: __esri.GraphicConstructor;
  private _simpleMarkeSymbol: __esri.SimpleMarkerSymbolConstructor;

  // tslint:disable-next-line: naming-convention
  get Point(): __esri.PointConstructor {
    return this._point;
  }

  // tslint:disable-next-line: naming-convention
  get Graphic(): __esri.GraphicConstructor {
    return this._graphic;
  }

  // tslint:disable-next-line: naming-convention
  get SimpleMarkerSymbol(): __esri.SimpleMarkerSymbolConstructor {
    return this._simpleMarkeSymbol;
  }

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._graphic) {
      [this._point, this._graphic, this._simpleMarkeSymbol] = await this._loader.load<
        __esri.PointConstructor,
        __esri.GraphicConstructor,
        __esri.SimpleMarkerSymbolConstructor
      >(['esri/geometry/Point', 'esri/Graphic', 'esri/symbols/SimpleMarkerSymbol']);
    }
  }
}
