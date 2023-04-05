import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import {
  GeoJSONSource,
  LayerSpecification,
  Map as MaplibreMap,
  MapGeoJSONFeature,
} from 'maplibre-gl';

import { SBB_ROKAS_STATION_HOVER_SOURCE } from '../constants';

import { toFeatureCollection } from './util/feature-collection-util';

export const SBB_STATION_LAYER = 'rokas-station-hover';
const SBB_ROKAS_ENDPOINT_LAYERS = [
  'rokas-route-transfer-ending', // V2
  'rokas-walk-from', // V1
  'rokas-walk-to', // V1
];

@Injectable({ providedIn: 'root' })
export class SbbMapStationService {
  registerStationUpdater(map: MaplibreMap): () => void {
    const stationLayers = this._extractStationLayers(map);
    if (!stationLayers) {
      throw new Error('Could not extract stationLayers.');
    }

    if (map.loaded()) {
      this._updateStationSource(map, stationLayers);
    } else {
      map.once('idle', () => this._updateStationSource(map, stationLayers));
    }

    const stationListener = () =>
      map.once('idle', () => this._updateStationSource(map, stationLayers));
    map.on('moveend', stationListener);
    return stationListener;
  }

  deregisterStationUpdater(map: MaplibreMap, listener: () => void): void {
    if (listener) {
      map.off('moveend', listener);
    }
  }

  private _updateStationSource(map: MaplibreMap, stationLayers: string[]): void {
    const features: Feature[] = map
      .queryRenderedFeatures(undefined, { layers: stationLayers })
      .map(this._mapToFeature);

    features.push(...this._getRouteEndpoints(map));

    map.removeFeatureState({ source: SBB_ROKAS_STATION_HOVER_SOURCE });
    const source = map.getSource(SBB_ROKAS_STATION_HOVER_SOURCE) as GeoJSONSource;
    source.setData(toFeatureCollection(features));
  }

  private _getRouteEndpoints(map: MaplibreMap): Feature[] {
    const endpoints = map
      .queryRenderedFeatures(undefined, { layers: SBB_ROKAS_ENDPOINT_LAYERS })
      .filter((f) => {
        return 'sbb_id' in f.properties;
      })
      .map(this._mapToFeature);

    if (!endpoints.length) {
      return [];
    }

    return endpoints
      .map(
        (p) =>
          map
            .querySourceFeatures('base', {
              sourceLayer: 'osm_points',
              filter: ['in', 'sbb_id', String(p.properties['sbb_id'])],
            })
            .map((sourceFeature) => ({
              ...this._mapToFeature(sourceFeature),
              geometry: p.geometry, // get endpoint location not the tile source
            }))
            .pop() // There might be multiple stations in the tile source
      )
      .filter((s) => s!!) as Feature[];
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

  private _mapToFeature(f: MapGeoJSONFeature) {
    return { type: f.type, properties: f.properties, geometry: f.geometry };
  }
}
