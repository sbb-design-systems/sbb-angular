import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { SBB_ROKAS_EXTRUSION_SOURCE } from '../constants';

import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';

@Injectable({ providedIn: 'root' })
export class SbbMapExtrusionService {
  addExtrusions(
    map: MaplibreMap,
    extrusions: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION,
  ): void {
    const source = map.getSource(SBB_ROKAS_EXTRUSION_SOURCE) as GeoJSONSource;
    source.setData(extrusions);
  }
}
