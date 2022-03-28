import { Injectable } from '@angular/core';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { FeatureDataType } from '../../journey-maps-client.interfaces';
import { ZONE_SOURCE } from '../constants';

import { MapSelectionEventService } from './events/map-selection-event.service';
import { EMPTY_FEATURE_COLLECTION } from './map.service';

@Injectable({ providedIn: 'root' })
export class MapZoneService {
  static readonly ZONE_LAYER: string = 'rokas-zone';

  updateZones(
    map: MaplibreMap,
    mapSelectionEventService: MapSelectionEventService,
    zonesFeatureCollection: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION
  ): void {
    const source = map.getSource(ZONE_SOURCE) as GeoJSONSource;
    source.setData(zonesFeatureCollection);

    map.removeFeatureState({ source: ZONE_SOURCE });

    if (zonesFeatureCollection.features?.length) {
      map.once('idle', () => {
        mapSelectionEventService.initSelectedState(
          map,
          zonesFeatureCollection.features,
          FeatureDataType.ZONE
        );
      });
    }
  }
}
