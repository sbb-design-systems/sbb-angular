import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbJourneyMetaInformation } from '../../journey-maps.interfaces';
import { ROKAS_ROUTE_SOURCE } from '../constants';
import { SbbRouteSourceService } from '../source/route-source-service';
import { SbbTransferSourceService } from '../source/transfer-source-service';
import { isV1Style } from '../source/util/style-version-lookup';

import { SbbMapEventUtils } from './../map/events/map-event-utils';
import { SbbMapSelectionEvent, SBB_SELECTED_PROPERTY_NAME } from './events/map-selection-event';
import { SBB_ROUTE_ID_PROPERTY_NAME } from './events/route-utils';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';
import { SbbMapStopoverService } from './map-stopover-service';

@Injectable({
  providedIn: 'root',
})
export class SbbMapJourneyService {
  constructor(
    private _sourceRouteService: SbbRouteSourceService,
    private _transferSourceService: SbbTransferSourceService,
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

    if (isV1Style(map)) {
      this._sourceRouteService.updateRoute(map, mapSelectionEventService, {
        type: 'FeatureCollection',
        features: routeFeatures,
      });

      this._transferSourceService.updateTransferV1(map, {
        type: 'FeatureCollection',
        features: transferFeatures,
      });
    } else {
      this._sourceRouteService.updateRoute(map, mapSelectionEventService, {
        type: 'FeatureCollection',
        features: routeFeatures.concat(transferFeatures),
      });

      if (journeyMetaInformation?.selectedLegId) {
        this._handleSelectedLeg(journey, map, journeyMetaInformation.selectedLegId);
        this._setNotSelectedLegIds(map, journeyMetaInformation.selectedLegId);
      } else {
        this._setNotSelectedLegIds(map);
      }
    }
  }

  private _setNotSelectedLegIds(map: MaplibreMap, selectedLegId?: string) {
    map.once('idle', () => {
      map
        .querySourceFeatures(ROKAS_ROUTE_SOURCE, {
          sourceLayer: 'ignored',
          filter: ['has', 'legId'],
        })
        .forEach((f) => {
          f.source = ROKAS_ROUTE_SOURCE;
          map.setFeatureState(f, {
            // FIXME shouldn't we call this field 'selected' instead of 'not-selected', to simplify?
            'not-selected': f.properties.legId !== selectedLegId,
          });
        });
    });
  }

  // TODO cdi ROKAS-1204 extract code into proper methods/classes
  private _handleSelectedLeg(journey: FeatureCollection, map: MaplibreMap, selectedLegId: string) {
    // filter and group the features by legId
    const featuresByLegId: Map<string, Feature[]> = groupByLegId(journey.features);
    if (featuresByLegId.has(selectedLegId)) {
      // put stopovers into stopover source
      const selectedStopoverFeatures = featuresByLegId
        .get(selectedLegId)!
        .filter((feature) => feature.properties?.type === 'stopover');
      this._mapStopoverService.updateStopovers(map, {
        type: 'FeatureCollection',
        features: selectedStopoverFeatures,
      });
    }
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
