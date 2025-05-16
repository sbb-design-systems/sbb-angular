import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { SBB_ROKAS_ROUTE_SOURCE, SBB_ROKAS_STOPOVER_SOURCE } from '../constants';

import { SbbMapSelectionEvent } from './events/map-selection-event';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';
import { groupBy } from './util/array-utils';
import { toFeatureCollection } from './util/feature-collection-util';

@Injectable({ providedIn: 'root' })
export class SbbMapRouteService {
  updateRoute(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    routeFeatureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION,
    stopoverFeatures: Feature[] = [],
    selectedLegId?: string,
  ): void {
    const source = map.getSource(SBB_ROKAS_ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
    map.removeFeatureState({ source: SBB_ROKAS_ROUTE_SOURCE });
    if (routeFeatureCollection.features?.length) {
      map.once('idle', () =>
        mapSelectionEventService.initSelectedState(map, routeFeatureCollection.features, 'ROUTE'),
      );
    }
    this.handleLegSelection(map, stopoverFeatures, selectedLegId);
  }

  handleLegSelection(map: MaplibreMap, stopoverFeatures: Feature[], selectedLegId?: string) {
    this._handleStopovers(stopoverFeatures, map, selectedLegId);
    this._setNotSelectedLegs(map, selectedLegId);
  }

  private _setNotSelectedLegs(map: MaplibreMap, selectedLegId?: string) {
    map.once('idle', () => {
      map
        .querySourceFeatures(SBB_ROKAS_ROUTE_SOURCE, {
          sourceLayer: 'ignored',
          filter: ['has', 'legId'],
        })
        .forEach((f) => {
          f.source = SBB_ROKAS_ROUTE_SOURCE;
          // unless ONE leg is manually selected, ALL legs should show as selected
          const selected = selectedLegId ? f.properties['legId'] === selectedLegId : true;
          map.setFeatureState(f, {
            'not-selected': !selected,
          });
        });
    });
  }

  private _handleStopovers(stopoverFeatures: Feature[], map: MaplibreMap, selectedLegId?: string) {
    const source = map.getSource(SBB_ROKAS_STOPOVER_SOURCE) as GeoJSONSource;
    if (source) {
      const featuresByLegId: Map<string, Feature[]> = this._groupByLegId(stopoverFeatures);
      const selectedStopoverFeatures =
        selectedLegId && featuresByLegId.has(selectedLegId)
          ? featuresByLegId.get(selectedLegId)!
          : [];
      source.setData(toFeatureCollection(selectedStopoverFeatures));
    }
  }

  private _groupByLegId(features: Array<Feature>): Map<string, Feature[]> {
    const featuresWithLegIds = features.filter((f) => f.properties?.['legId']);
    const groupedByLegId = groupBy(
      featuresWithLegIds,
      (curr: Feature) => curr.properties!['legId'],
    );
    return new Map(Object.entries(groupedByLegId));
  }
}
