import { SbbEsriTypesService } from '../../esri-types/esri-types.service';

import { SbbMarkerSymbolSettings } from './marker-symbol.settings';

export class SbbMarkerSymbolFactory {
  constructor(private _esri: SbbEsriTypesService) {}

  createCircleSymbol() {
    return new this._esri.SimpleMarkerSymbol(SbbMarkerSymbolSettings.simpleSymbol);
  }
}
