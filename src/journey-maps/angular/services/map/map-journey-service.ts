import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbJourneyMetaInformation } from '../../journey-maps.interfaces';

import { SbbMapEventUtils } from './../map/events/map-event-utils';
import { SbbMapSelectionEvent, SBB_SELECTED_PROPERTY_NAME } from './events/map-selection-event';
import { SBB_ROUTE_ID_PROPERTY_NAME } from './events/route-utils';
import { SbbMapRouteService } from './map-route-service';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';
import { SbbMapStopoverService } from './map-stopover-service';
import { SbbMapTransferService } from './map-transfer-service';

@Injectable({
  providedIn: 'root',
})
export class SbbMapJourneyService {
  constructor(
    private _mapRouteService: SbbMapRouteService,
    private _mapTransferService: SbbMapTransferService,
    private _mapStopoverService: SbbMapStopoverService,
    private _mapEventUtils: SbbMapEventUtils // TODO cdi ROKAS-1204 move this to it's own (e.g. util) class
  ) {}

  updateJourney(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    journey: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION,
    journeyMetaInformation?: SbbJourneyMetaInformation
  ): void {
    const routeFeatures: Feature[] = [];
    const transferFeatures: Feature[] = [];

    // TODO cdi ROKAS-1204 extract code into proper methods/classes

    // filter and group the features by legId
    const featuresByLegId: Map<string, Feature[]> = groupByLegId(journey.features);
    const { selectedLegId } = journeyMetaInformation ?? {};
    if (selectedLegId) {
      // list of legIds
      const legIds = [...featuresByLegId.keys()];
      if (featuresByLegId.has(selectedLegId)) {
        // put stopovers into stopover source
        const selectedStopoverFeatures = featuresByLegId
          .get(selectedLegId)!
          .filter((feature) => feature.properties?.type === 'stopover');
        this._mapStopoverService.updateStopovers(map, {
          type: 'FeatureCollection',
          features: selectedStopoverFeatures,
        });

        // set unselected legs as not selected
        legIds
          .filter((legId) => legId !== selectedLegId)
          .filter((legId) => featuresByLegId.has(legId))
          .map((legId) => featuresByLegId.get(legId))
          .forEach(
            (features) => null
            // features!.forEach(feature =>
            //   this._mapEventUtils.setFeatureState(feature, map, {selected: false})
          );
      }
    }

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

const groupByLegId = (features: Array<Feature>): Map<string, Feature[]> => {
  const groupedByLegId = features
    .filter((f) => f.properties?.legId)
    .reduce(
      (res: any, curr: Feature) => ({
        ...res,
        [curr.properties!.legId]: [...(res[curr.properties!.legId] || []), curr],
      }),
      {}
    );
  return new Map(Object.entries(groupedByLegId));
};
