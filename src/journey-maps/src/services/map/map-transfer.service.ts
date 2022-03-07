import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';
import {EMPTY_FEATURE_COLLECTION} from './map.service';

@Injectable({providedIn: 'root'})
export class MapTransferService {

  private data: GeoJSON.FeatureCollection;

  updateTransfer(map: MaplibreMap, featureCollection: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION): void {
    this.getSource(map).setData(featureCollection);
    this.data = featureCollection;
  }

  // If we enter the station on another floor than '0' then the outdoor route should be displayed
  // on two floors. (Floor 0 and 'entrance' floor)
  updateOutdoorWalkFloor(map: MaplibreMap, level: number): void {
    let floorChanged = false;

    (this.data?.features ?? [])
      .filter(f => +f.properties.additionalFloor === level)
      .forEach(f => {
        const floor = f.properties.floor;
        f.properties.floor = f.properties.additionalFloor;
        f.properties.additionalFloor = floor;
        floorChanged = true;
      });

    if (floorChanged) {
      this.getSource(map).setData(this.data);
    }
  }

  private getSource(map: MaplibreMap): GeoJSONSource {
    return map.getSource(Constants.WALK_SOURCE) as GeoJSONSource;
  }
}
