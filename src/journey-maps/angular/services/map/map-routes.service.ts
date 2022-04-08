import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbSelectableFeatureCollection } from '../../journey-maps.interfaces';

import { SbbMapSelectionEvent, SBB_SELECTED_PROPERTY_NAME } from './events/map-selection-event';
import { SBB_ROUTE_ID_PROPERTY_NAME } from './events/route-utils';
import { SbbMapRouteService } from './map-route-service';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';

export const SBB_ALL_ROUTE_LAYERS: string[] = [
  'rokas-route',
  'rokas-route-gen0',
  'rokas-route-gen1',
  'rokas-route-gen2',
  'rokas-route-gen3',
  'rokas-route-gen4',
];

@Injectable({ providedIn: 'root' })
export class SbbMapRoutesService {
  constructor(private _mapRouteService: SbbMapRouteService) {}

  updateRoutes(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    routes: SbbSelectableFeatureCollection[] = [SBB_EMPTY_FEATURE_COLLECTION]
  ): void {
    routes.forEach((featureCollection, idx) => {
      const id = featureCollection.id ?? `jmc-generated-${idx + 1}`;
      for (const feature of featureCollection.features) {
        feature.properties![SBB_ROUTE_ID_PROPERTY_NAME] = id;
        feature.properties![SBB_SELECTED_PROPERTY_NAME] = featureCollection.isSelected;
      }
    });
    this._mapRouteService.updateRoute(map, mapSelectionEventService, {
      type: 'FeatureCollection',
      // With ES2019 we can replace this with routes.flatMap(({features}) => features)
      features: routes.reduce(
        (accumulatedFeatures, next) => accumulatedFeatures.concat(next.features as any),
        []
      ),
    });
  }
}
