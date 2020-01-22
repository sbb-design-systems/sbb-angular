import { Injectable } from '@angular/core';
import { EsriLoaderService } from 'projects/sbb-esta/angular-maps/esri-config/src/esri-loader.service';

import { EsriLegendModule } from '../esri-legend.module';

@Injectable()
export class EsriTypesService {
  private _legend: __esri.LegendConstructor;

  // tslint:disable-next-line: naming-convention
  get Legend(): __esri.LegendConstructor {
    return this._legend;
  }

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._legend) {
      [this._legend] = await this._loader.load<__esri.LegendConstructor>(['esri/widgets/Legend']);
    }
  }
}
