import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { SBB_ROKAS_ROUTE_SOURCE, SBB_ROKAS_WALK_SOURCE } from '../constants';

import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';
import { isV1Style } from './util/style-version-lookup';
import { needsFloorChange, updateWalkFloor } from './util/walk-floor-updater';

@Injectable({ providedIn: 'root' })
export class SbbMapTransferService {
  private _data: FeatureCollection;

  // calling this method only makes sense for clients using the v1 style.
  updateTransfer(
    map: MaplibreMap,
    transfer: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION,
  ): void {
    this._getSource(map).setData(transfer);
    this._data = transfer;
  }

  // If we enter the station on another floor than '0' then the outdoor route should be displayed
  // on two floors. (Floor 0 and 'entrance' floor)
  updateOutdoorWalkFloor(map: MaplibreMap, level: number | undefined): void {
    const features: Feature[] = this._data?.features ?? [];
    if (needsFloorChange(features, level)) {
      this._data.features = updateWalkFloor(features, level);
      this._getSource(map).setData(this._data);
    }
  }

  private _getSource(map: MaplibreMap): GeoJSONSource {
    return map.getSource(
      isV1Style(map) ? SBB_ROKAS_WALK_SOURCE : SBB_ROKAS_ROUTE_SOURCE,
    ) as GeoJSONSource;
  }
}
