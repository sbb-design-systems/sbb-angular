import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbJourneyMetaInformation } from '../../journey-maps.interfaces';
import { SBB_ROKAS_ROUTE_SOURCE } from '../constants';

import { SbbMapEventUtils } from './../map/events/map-event-utils';
import { SbbMapSelectionEvent, SBB_SELECTED_PROPERTY_NAME } from './events/map-selection-event';
import { SBB_ROUTE_ID_PROPERTY_NAME } from './events/route-utils';
import { SbbMapRoutesService } from './map-routes.service';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';
import { SbbMapStopoverService } from './map-stopover-service';
import { SbbMapTransferService } from './map-transfer-service';
import { isV1Style } from './util/style-version-lookup';

@Injectable({
  providedIn: 'root',
})
export class SbbMapJourneyService {
  constructor(
    private _mapRoutesService: SbbMapRoutesService,
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
      this._mapRoutesService.updateRoute(map, mapSelectionEventService, {
        type: 'FeatureCollection',
        features: routeFeatures,
      });

      this._mapTransferService.updateTransfer(map, {
        type: 'FeatureCollection',
        features: transferFeatures,
      });
    } else {
      this._mapRoutesService.updateRoute(map, mapSelectionEventService, {
        type: 'FeatureCollection',
        features: routeFeatures.concat(transferFeatures),
      });

      this._handleLegIdSelection(map, journey.features, journeyMetaInformation?.selectedLegId);
    }
  }

  private _handleLegIdSelection(map: MaplibreMap, features: Feature[], selectedLegId?: string) {
    this._handleStopovers(features, map, selectedLegId);
    this._setNotSelectedLegIds(map, selectedLegId);
  }

  private _setNotSelectedLegIds(map: MaplibreMap, selectedLegId?: string) {
    map.once('idle', () => {
      map
        .querySourceFeatures(SBB_ROKAS_ROUTE_SOURCE, {
          sourceLayer: 'ignored',
          filter: ['has', 'legId'],
        })
        .forEach((f) => {
          f.source = SBB_ROKAS_ROUTE_SOURCE;
          // unless ONE leg is manually selected, ALL legs should show as selected => {'not-selected: false }
          const selected = selectedLegId ? f.properties.legId === selectedLegId : true;
          map.setFeatureState(f, {
            'not-selected': !selected,
          });
        });
    });
  }

  private _handleStopovers(features: Feature[], map: MaplibreMap, selectedLegId?: string) {
    const featuresByLegId: Map<string, Feature[]> = this._groupByLegId(features);
    const selectedStopoverFeatures = (
      selectedLegId && featuresByLegId.has(selectedLegId) ? featuresByLegId.get(selectedLegId)! : []
    ).filter((feature) => feature.properties?.type === 'stopover');
    this._mapStopoverService.updateStopovers(map, {
      type: 'FeatureCollection',
      features: selectedStopoverFeatures,
    });
  }

  private _groupByLegId(features: Array<Feature>): Map<string, Feature[]> {
    // filter and group the features by legId
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
  }
}
