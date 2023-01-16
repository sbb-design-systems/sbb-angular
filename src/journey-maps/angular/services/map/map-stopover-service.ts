import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { SBB_ROKAS_STOPOVER_SOURCE } from '../constants';

import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';

@Injectable({ providedIn: 'root' })
export class SbbMapStopoverService {
  updateStopovers(
    map: MaplibreMap,
    routeFeatureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    const source = map.getSource(SBB_ROKAS_STOPOVER_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
  }
}
