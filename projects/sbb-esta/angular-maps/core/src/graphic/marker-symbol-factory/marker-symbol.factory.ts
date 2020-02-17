import { EsriTypesService } from '../../esri-types/esri-types.service';

import { MarkerSymbolSettings } from './marker-symbol.settings';

export class MarkerSymbolFactory {
  constructor(private _esri: EsriTypesService) {}

  createCircleSymbol() {
    return new this._esri.SimpleMarkerSymbol(MarkerSymbolSettings.simpleSymbol);
  }
}
