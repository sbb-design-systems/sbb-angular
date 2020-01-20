import { Injectable } from '@angular/core';

import { EsriLoaderService } from '../../esri-config/esri-loader.service';

@Injectable()
export class EsriTypesService {
  private _legend: __esri.LegendConstructor;
  private _layerList: __esri.LayerListConstructor;
  private _basemapGallery: __esri.BasemapGalleryConstructor;

  // tslint:disable-next-line: naming-convention
  get Legend(): __esri.LegendConstructor {
    return this._legend;
  }

  // tslint:disable-next-line: naming-convention
  get LayerList(): __esri.LayerListConstructor {
    return this._layerList;
  }

  // tslint:disable-next-line: naming-convention
  get BasemapGallery(): __esri.BasemapGalleryConstructor {
    return this._basemapGallery;
  }

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._basemapGallery) {
      [this._legend, this._layerList, this._basemapGallery] = await this._loader.load<
        __esri.LegendConstructor,
        __esri.LayerListConstructor,
        __esri.BasemapGalleryConstructor,
        __esri.PointConstructor,
        __esri.GraphicConstructor,
        __esri.SimpleMarkerSymbolConstructor
      >(['esri/widgets/Legend', 'esri/widgets/LayerList', 'esri/widgets/BasemapGallery']);
    }
  }
}
