import { Injectable } from '@angular/core';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { ROUTE_SOURCE } from '../constants';

import { MapSelectionEventService } from './events/map-selection-event.service';
import { EMPTY_FEATURE_COLLECTION } from './map.service';

@Injectable({ providedIn: 'root' })
export class MapRouteService {
  updateRoute(
    map: MaplibreMap,
    mapSelectionEventService: MapSelectionEventService,
    routeFeatureCollection: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION
  ): void {
    const source = map.getSource(ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
    map.removeFeatureState({ source: ROUTE_SOURCE });
    if (routeFeatureCollection.features?.length) {
      map.once('idle', () =>
        mapSelectionEventService.initSelectedState(map, routeFeatureCollection.features, 'ROUTE')
      );
    }
  }
}
