import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { SBB_ROUTE_SOURCE } from '../constants';

import { SbbMapSelectionEvent } from './events/map-selection-event';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';

@Injectable({ providedIn: 'root' })
export class SbbMapRouteService {
  updateRoute(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    routeFeatureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    const source = map.getSource(SBB_ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
    map.removeFeatureState({ source: SBB_ROUTE_SOURCE });
    if (routeFeatureCollection.features?.length) {
      map.once('idle', () =>
        mapSelectionEventService.initSelectedState(map, routeFeatureCollection.features, 'ROUTE')
      );
    }
  }
}
