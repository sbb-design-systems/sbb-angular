import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import {
  MapSelectionEventService,
  SELECTED_PROPERTY_NAME,
} from './events/map-selection-event.service';
import { ROUTE_ID_PROPERTY_NAME } from './events/route-utils.service';
import { MapRouteService } from './map-route.service';
import { MapTransferService } from './map-transfer.service';
import { EMPTY_FEATURE_COLLECTION } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class MapJourneyService {
  constructor(
    private _mapRouteService: MapRouteService,
    private _mapTransferService: MapTransferService
  ) {}

  updateJourney(
    map: MaplibreMap,
    mapSelectionEventService: MapSelectionEventService,
    journey: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION
  ): void {
    const routeFeatures: GeoJSON.Feature[] = [];
    const transferFeatures: GeoJSON.Feature[] = [];

    for (const feature of journey.features) {
      const properties = feature.properties!;
      const type = properties.type;
      const pathType = properties.pathType;

      properties[ROUTE_ID_PROPERTY_NAME] = 'journey'; // They all belong together
      properties[SELECTED_PROPERTY_NAME] = true; // Always selected

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
