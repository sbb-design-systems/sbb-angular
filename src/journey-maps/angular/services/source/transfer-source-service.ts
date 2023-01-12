import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { ROKAS_WALK_SOURCE } from '../constants';
import { SBB_EMPTY_FEATURE_COLLECTION } from '../map/map-service';

import { needsFloorChange, updateWalkFloor } from './util/walk-floor-updater';

@Injectable({ providedIn: 'root' })
export class SbbTransferSourceService {
  private _data: FeatureCollection;

  updateTransferV1(
    map: MaplibreMap,
    featureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    this._getSource(map).setData(featureCollection);
    this._data = featureCollection;
  }

  // If we enter the station on another floor than '0' then the outdoor route should be displayed
  // on two floors. (Floor 0 and 'entrance' floor)
  updateOutdoorWalkFloorV1(map: MaplibreMap, level: number): void {
    const features: Feature[] = this._data?.features ?? [];
    if (needsFloorChange(features, level)) {
      this._data.features = updateWalkFloor(features, level);
      this._getSource(map).setData(this._data);
    }
  }

  private _getSource(map: MaplibreMap): GeoJSONSource {
    return map.getSource(ROKAS_WALK_SOURCE) as GeoJSONSource;
  }
}
