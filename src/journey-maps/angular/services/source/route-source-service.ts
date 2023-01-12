import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { ROKAS_ROUTE_SOURCE } from '../constants';
import { SbbMapSelectionEvent } from '../map/events/map-selection-event';
import { SBB_EMPTY_FEATURE_COLLECTION } from '../map/map-service';

@Injectable({ providedIn: 'root' })
export class SbbRouteSourceService {
  private _data: FeatureCollection;

  updateRoute(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    routeFeatureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    const source = map.getSource(ROKAS_ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
    map.removeFeatureState({ source: ROKAS_ROUTE_SOURCE });
    if (routeFeatureCollection.features?.length) {
      map.once('idle', () =>
        mapSelectionEventService.initSelectedState(map, routeFeatureCollection.features, 'ROUTE')
      );
    }
  }

  updateTransferV2(
    map: MaplibreMap,
    featureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    this._getSource(map).setData(featureCollection);
    this._data = featureCollection;
  }

  // If we enter the station on another floor than '0' then the outdoor route should be displayed
  // on two floors. (Floor 0 and 'entrance' floor)
  updateOutdoorWalkFloorV2(map: MaplibreMap, level: number): void {
    let floorChanged = false;

    (this._data?.features ?? [])
      .filter((f: { [name: string]: any }) => +f.properties.additionalFloor === level)
      .forEach((f: { [name: string]: any }) => {
        const floor = f.properties.floor;
        f.properties.floor = f.properties.additionalFloor;
        f.properties.additionalFloor = floor;
        floorChanged = true;
      });

    if (floorChanged) {
      this._getSource(map).setData(this._data);
    }
  }

  private _getSource(map: MaplibreMap): GeoJSONSource {
    return map.getSource(ROKAS_ROUTE_SOURCE) as GeoJSONSource;
  }
}
