import { Injectable } from '@angular/core';
import { SbbRailNetworkOptions } from '@sbb-esta/journey-maps/angular';
import { Map as MaplibreMap } from 'maplibre-gl';

const SBB_RAIL_NETWORK_LAYER_ID = '-track';

@Injectable({ providedIn: 'root' })
export class SbbMapRailNetworkService {
  updateOptions(map: MaplibreMap, options: SbbRailNetworkOptions) {
    console.error('options not supported:', options);
  }
}
