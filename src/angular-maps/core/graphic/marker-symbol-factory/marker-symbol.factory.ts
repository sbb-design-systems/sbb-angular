import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

import { SbbMarkerSymbolSettings } from './marker-symbol.settings';

export class SbbMarkerSymbolFactory {
  constructor() {}

  createCircleSymbol() {
    return new SimpleMarkerSymbol(SbbMarkerSymbolSettings.simpleSymbol);
  }
}
