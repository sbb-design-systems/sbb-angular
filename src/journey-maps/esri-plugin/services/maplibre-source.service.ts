import { EventEmitter, Injectable } from '@angular/core';

import { MaplibreMap, SbbEsriFeatureLayer } from '../esri-plugin.interface';

import { MaplibreUtilService } from './maplibre-util.service';

@Injectable({
  providedIn: 'root',
})
export class MaplibreSourceService {
  constructor(private _maplibreUtilService: MaplibreUtilService) {}

  addFeaturesAsMapSource(
    map: MaplibreMap,
    features: GeoJSON.Feature<GeoJSON.Geometry>[],
    layer: SbbEsriFeatureLayer,
    mapSourceAdded: EventEmitter<string>,
  ): void {
    const sourceId = this._maplibreUtilService.getSourceId(layer);
    map.addSource(sourceId, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });
    mapSourceAdded.next(sourceId);
  }
}
