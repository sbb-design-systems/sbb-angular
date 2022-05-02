import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbPointsOfInterestOptions } from '../../journey-maps.interfaces';

export const SBB_POIS_LAYER = 'journey-pois';
const SBB_POIS_LAYER_LIST = [SBB_POIS_LAYER, 'journey-pois-hover', 'journey-pois-selected'];

@Injectable({ providedIn: 'root' })
export class SbbMapPoisService {
  configurePoiOptions(map: MaplibreMap, poiOptions?: SbbPointsOfInterestOptions): void {
    const hasAnyPois = poiOptions?.categories?.length;
    if (hasAnyPois) {
      SBB_POIS_LAYER_LIST.forEach((layerId) => {
        map.setFilter(layerId, ['in', 'subCategory', ...poiOptions.categories]);
      });
    }

    SBB_POIS_LAYER_LIST.forEach((layerId) => {
      map.setLayoutProperty(layerId, 'visibility', hasAnyPois ? 'visible' : 'none');
    });
  }
}
