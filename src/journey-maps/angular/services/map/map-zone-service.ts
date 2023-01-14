import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { ROKAS_ZONE_SOURCE } from '../constants';

import { SbbMapSelectionEvent } from './events/map-selection-event';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';

export const SBB_ZONE_LAYER = 'rokas-zone';

@Injectable({ providedIn: 'root' })
export class SbbMapZoneService {
  updateZones(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    zonesFeatureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    const source = map.getSource(ROKAS_ZONE_SOURCE) as GeoJSONSource;
    source.setData(zonesFeatureCollection);

    map.removeFeatureState({ source: ROKAS_ZONE_SOURCE });

    // `zonesFeatureCollection` somehow manages to be null if we change the style from v2 to v1
    if (zonesFeatureCollection?.features?.length) {
      map.once('idle', () => {
        mapSelectionEventService.initSelectedState(map, zonesFeatureCollection.features, 'ZONE');
      });
    }
  }
}
