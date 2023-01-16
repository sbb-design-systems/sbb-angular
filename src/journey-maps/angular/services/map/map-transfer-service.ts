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

  updateTransfer(
    map: MaplibreMap,
    featureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    if (isV1Style(map)) {
      this._updateTransferV1(map, featureCollection);
    } else {
      this._updateTransferV2(map, featureCollection);
    }
  }

  // If we enter the station on another floor than '0' then the outdoor route should be displayed
  // on two floors. (Floor 0 and 'entrance' floor)
  updateOutdoorWalkFloor(map: MaplibreMap, level: number): void {
    if (isV1Style(map)) {
      this._updateOutdoorWalkFloorV1(map, level);
    } else {
      this._updateOutdoorWalkFloorV2(map, level);
    }
  }

  private _updateTransferV1(
    map: MaplibreMap,
    featureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    this._getSourceV1(map).setData(featureCollection);
    this._data = featureCollection;
  }

  private _updateTransferV2(
    map: MaplibreMap,
    featureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    this._getSourceV2(map).setData(featureCollection);
    this._data = featureCollection;
  }

  private _updateOutdoorWalkFloorV1(map: MaplibreMap, level: number): void {
    const features: Feature[] = this._data?.features ?? [];
    if (needsFloorChange(features, level)) {
      this._data.features = updateWalkFloor(features, level);
      this._getSourceV1(map).setData(this._data);
    }
  }

  private _updateOutdoorWalkFloorV2(map: MaplibreMap, level: number): void {
    const features: Feature[] = this._data?.features ?? [];
    if (needsFloorChange(features, level)) {
      this._data.features = updateWalkFloor(features, level);
      this._getSourceV2(map).setData(this._data);
    }
  }

  private _getSourceV1(map: MaplibreMap): GeoJSONSource {
    return map.getSource(SBB_ROKAS_WALK_SOURCE) as GeoJSONSource;
  }

  private _getSourceV2(map: MaplibreMap): GeoJSONSource {
    return map.getSource(SBB_ROKAS_ROUTE_SOURCE) as GeoJSONSource;
  }
}
