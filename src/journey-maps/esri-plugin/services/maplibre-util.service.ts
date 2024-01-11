import { Injectable } from '@angular/core';

import { SbbEsriFeatureLayer } from '../esri-plugin.interface';

@Injectable({
  providedIn: 'root',
})
export class MaplibreUtilService {
  getLayerId(layer: SbbEsriFeatureLayer): string {
    return layer.url.replace(/\W/g, '_');
  }

  getSourceId(layer: SbbEsriFeatureLayer): string {
    return `${this.getLayerId(layer)}-source`;
  }
}
