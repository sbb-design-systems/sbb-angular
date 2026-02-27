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
import { isV1Style } from './util/style-version-lookup';

export const SBB_STATION_LAYER = 'rokas-station-hover';
const MAP_ENDPOINT_LAYERS_V1 = ['rokas-walk-from', 'rokas-walk-to'];
const MAP_ENDPOINT_LAYERS_V2 = ['rokas-route-transfer-ending', 'rokas-route-stopover-circle'];
const MAP_SOURCE_LAYER_OSM_POINTS = 'osm_points';
const FEATURE_SBB_ID_FIELD_NAME = 'sbb_id'; // old name in journey-maps response (v1)
const FEATURE_DIDOK_CODE_FIELD_NAME = 'didokCode'; // new name in journey-routes response (v2)

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
      .queryRenderedFeatures(undefined, {
        layers: isV1Style(map) ? MAP_ENDPOINT_LAYERS_V1 : MAP_ENDPOINT_LAYERS_V2,
      })
      .filter((f) => {
        return (
          FEATURE_SBB_ID_FIELD_NAME in f.properties || FEATURE_DIDOK_CODE_FIELD_NAME in f.properties
        );
      })
      .map(this._mapToFeature);

    if (!endpoints.length) {
      return [];
    }

    return endpoints
      .map((p) => {
        // Get the ID value from either sbb_id or didokCode field
        const idValue =
          p.properties[FEATURE_SBB_ID_FIELD_NAME] || p.properties[FEATURE_DIDOK_CODE_FIELD_NAME];

        return map
          .querySourceFeatures('base', {
            sourceLayer: MAP_SOURCE_LAYER_OSM_POINTS,
            filter: [
              'any',
              ['in', FEATURE_SBB_ID_FIELD_NAME, String(idValue)],
              ['in', FEATURE_DIDOK_CODE_FIELD_NAME, String(idValue)],
            ],
          })
          .map((sourceFeature) => ({
            ...this._mapToFeature(sourceFeature),
            geometry: p.geometry, // get endpoint location not the tile source
          }))
          .pop(); // There might be multiple stations in the tile source
      })
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
          ((sourceLayer === MAP_SOURCE_LAYER_OSM_POINTS && id !== MAP_SOURCE_LAYER_OSM_POINTS) ||
            (sourceLayer === 'poi' && id.startsWith('station_ship')))
        );
      })
      .map((layer: LayerSpecification) => layer.id);
  }

  private _mapToFeature(f: MapGeoJSONFeature) {
    return { type: f.type, properties: f.properties, geometry: f.geometry };
  }
}
