import { Injectable } from '@angular/core';
import { EsriLoaderService } from 'projects/sbb-esta/angular-maps/esri-config/src/esri-loader.service';

import { EsriLayerListModule } from '../esri-layer-list.module';

@Injectable()
export class EsriTypesService {
  private _layerList: __esri.LayerListConstructor;

  // tslint:disable-next-line: naming-convention
  get LayerList(): __esri.LayerListConstructor {
    return this._layerList;
  }

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._layerList) {
      [this._layerList] = await this._loader.load<__esri.LayerListConstructor>([
        'esri/widgets/LayerList'
      ]);
    }
  }
}
