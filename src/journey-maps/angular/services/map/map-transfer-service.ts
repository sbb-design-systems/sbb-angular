import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { SBB_WALK_SOURCE } from '../constants';

import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';

@Injectable({ providedIn: 'root' })
export class SbbMapTransferService {
  private _data: FeatureCollection;

  updateTransfer(
    map: MaplibreMap,
    featureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    this._getSource(map).setData(featureCollection);
    this._data = featureCollection;
  }

  // If we enter the station on another floor than '0' then the outdoor route should be displayed
  // on two floors. (Floor 0 and 'entrance' floor)
  updateOutdoorWalkFloor(map: MaplibreMap, level: number): void {
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
    return map.getSource(SBB_WALK_SOURCE) as GeoJSONSource;
  }
}
