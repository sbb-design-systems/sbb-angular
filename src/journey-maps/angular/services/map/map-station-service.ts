import { Injectable } from '@angular/core';
import { GeoJSONSource, LayerSpecification, Map as MaplibreMap } from 'maplibre-gl';

import { SBB_ROKAS_STATION_HOVER_SOURCE } from '../constants';

import { toFeatureCollection } from './util/feature-collection-util';

export const SBB_STATION_LAYER = 'rokas-station-hover';

@Injectable({ providedIn: 'root' })
export class SbbMapStationService {
  private _stationLayers: string[];
  private _listener: () => void;

  registerStationUpdater(map: MaplibreMap): void {
    this._stationLayers = this._stationLayers ?? this._extractStationLayers(map);

    if (map.loaded()) {
      this._updateStationSource(map);
    } else {
      map.once('idle', () => this._updateStationSource(map));
    }

    this._listener = () => map.once('idle', () => this._updateStationSource(map));
    map.on('moveend', this._listener);
  }

  deregisterStationUpdater(map: MaplibreMap): void {
    if (this._listener) {
      map.off('moveend', this._listener);
    }
  }

  private _updateStationSource(map: MaplibreMap): void {
    const features = map
      .queryRenderedFeatures(undefined, { layers: this._stationLayers })
      .map((f) => ({ type: f.type, properties: f.properties, geometry: f.geometry }));

    map.removeFeatureState({ source: SBB_ROKAS_STATION_HOVER_SOURCE });
    const source = map.getSource(SBB_ROKAS_STATION_HOVER_SOURCE) as GeoJSONSource;
    source.setData(toFeatureCollection(features));
  }

  private _extractStationLayers(map: MaplibreMap): string[] | undefined {
    return map
      .getStyle()
      .layers?.filter((layer: LayerSpecification) => {
        const sourceLayer = 'source-layer' in layer ? layer['source-layer'] : undefined;
        const id = layer.id;

        return (
          sourceLayer &&
          ((sourceLayer === 'osm_points' && id !== 'osm_points') ||
            (sourceLayer === 'poi' && id.startsWith('station_ship')))
        );
      })
      .map((layer: LayerSpecification) => layer.id);
  }
}
