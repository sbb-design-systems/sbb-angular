import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { ROKAS_WALK_SOURCE } from '../constants';

@Injectable({ providedIn: 'root' })
export class SbbStyleSourceService {
  isV1Style(map: MaplibreMap) {
    return !!map.getStyle().sources[ROKAS_WALK_SOURCE];
  }
}
