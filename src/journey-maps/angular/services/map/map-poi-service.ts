import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbPointsOfInterestOptions } from '../../journey-maps.interfaces';

export const SBB_POIS_LAYER = 'journey-pois';
export const SBB_POIS_INTERACTION_SOURCE = {
  source: 'journey-pois-source',
  sourceLayer: 'journey_pois',
};

@Injectable({ providedIn: 'root' })
export class SbbMapPoisService {
  configurePoiOptions(map: MaplibreMap, poiOptions?: SbbPointsOfInterestOptions): void {
    const hasAnyPois = poiOptions?.categories?.length;
    if (hasAnyPois) {
      map.setFilter(SBB_POIS_LAYER, ['in', 'subCategory', ...poiOptions.categories]);
    }
    map.setLayoutProperty(SBB_POIS_LAYER, 'visibility', hasAnyPois ? 'visible' : 'none');
  }
}
