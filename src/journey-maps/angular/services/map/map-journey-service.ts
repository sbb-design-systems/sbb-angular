import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbMapSelectionEvent, SBB_SELECTED_PROPERTY_NAME } from './events/map-selection-event';
import { SBB_ROUTE_ID_PROPERTY_NAME } from './events/route-utils';
import { SbbMapRouteService } from './map-route-service';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';
import { SbbMapTransferService } from './map-transfer-service';

@Injectable({
  providedIn: 'root',
})
export class SbbMapJourneyService {
  constructor(
    private _mapRouteService: SbbMapRouteService,
    private _mapTransferService: SbbMapTransferService
  ) {}

  updateJourney(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    journey: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    const routeFeatures: Feature[] = [];
    const transferFeatures: Feature[] = [];

    for (const feature of journey.features) {
      const properties = feature.properties!;
      const type = properties.type;
      const pathType = properties.pathType;

      properties[SBB_ROUTE_ID_PROPERTY_NAME] = 'journey'; // They all belong together
      properties[SBB_SELECTED_PROPERTY_NAME] = true; // Always selected

      if (type === 'path' && (pathType === 'transport' || pathType === 'bee')) {
        routeFeatures.push(feature);
      } else if (type === 'bbox' || type === 'stopover') {
        // Ignore the feature (NOSONAR)
      } else {
        transferFeatures.push(feature);
      }
    }

    this._mapRouteService.updateRoute(map, mapSelectionEventService, {
      type: 'FeatureCollection',
      features: routeFeatures,
    });

    this._mapTransferService.updateTransfer(map, {
      type: 'FeatureCollection',
      features: transferFeatures,
    });
  }
}
