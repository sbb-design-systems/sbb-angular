import { Injectable } from '@angular/core';
import { EsriLoaderService } from 'projects/sbb-esta/angular-maps/esri-config/src/esri-loader.service';

import { EsriBasemapGalleryModule } from '../esri-basemap-gallery.module';

@Injectable()
export class EsriTypesService {
  private _basemapGallery: __esri.BasemapGalleryConstructor;

  // tslint:disable-next-line: naming-convention
  get BasemapGallery(): __esri.BasemapGalleryConstructor {
    return this._basemapGallery;
  }

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._basemapGallery) {
      [this._basemapGallery] = await this._loader.load<__esri.BasemapGalleryConstructor>([
        'esri/widgets/BasemapGallery'
      ]);
    }
  }
}
