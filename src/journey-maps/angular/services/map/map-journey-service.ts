import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbMapSelectionEvent, SBB_SELECTED_PROPERTY_NAME } from './events/map-selection-event';
import { SBB_ROUTE_ID_PROPERTY_NAME } from './events/route-utils';
import { SbbMapRouteService } from './map-route-service';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';
import { SbbMapTransferService } from './map-transfer-service';
import { toFeatureCollection } from './util/feature-collection-util';
import { isV1Style } from './util/style-version-lookup';

@Injectable({
  providedIn: 'root',
})
export class SbbMapJourneyService {
  constructor(
    private _mapRouteService: SbbMapRouteService,
    private _mapTransferService: SbbMapTransferService,
  ) {}

  updateJourney(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    journey: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION,
    selectedLegId?: string,
  ): void {
    this._update(map, mapSelectionEventService, journey, selectedLegId);
  }

  updateTrip(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    trip: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION,
    selectedLegId?: string,
  ): void {
    this._update(map, mapSelectionEventService, trip, selectedLegId);
  }

  private _update(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    featureCollection: FeatureCollection,
    selectedLegId: string | undefined,
  ): void {
    const routeFeatures: Feature[] = [];
    const stopoverFeatures: Feature[] = [];
    const transferFeatures: Feature[] = [];

    for (const feature of featureCollection.features) {
      const properties = feature.properties!;
      const type = properties.type;
      const pathType = properties.pathType;
      const legId = properties.legId ?? 'journey'; // default: all belong together
      const isSelected = selectedLegId === legId || !selectedLegId; // default state: all selected

      properties[SBB_ROUTE_ID_PROPERTY_NAME] = legId;
      properties[SBB_SELECTED_PROPERTY_NAME] = isSelected;

      if (type === 'path' && (pathType === 'transport' || pathType === 'bee')) {
        routeFeatures.push(feature);
      } else if (type === 'stopover') {
        stopoverFeatures.push(feature);
      } else if (type === 'bbox') {
        // Ignore the feature (NOSONAR)
      } else {
        transferFeatures.push(feature);
      }
    }

    if (isV1Style(map)) {
      this._mapRouteService.updateRoute(
        map,
        mapSelectionEventService,
        toFeatureCollection(routeFeatures),
      );
      this._mapTransferService.updateTransfer(map, toFeatureCollection(transferFeatures));
    } else {
      this._mapRouteService.updateRoute(
        map,
        mapSelectionEventService,
        // handle transfer and routes together, otherwise they can overwrite each other's transfer or route data
        toFeatureCollection(routeFeatures.concat(transferFeatures)),
        stopoverFeatures,
        selectedLegId,
      );
    }
  }
}
