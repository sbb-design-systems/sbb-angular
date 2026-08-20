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
import { isShortbreadStyle, isV1Style } from './util/style-version-lookup';

export const SBB_STATION_LAYER = 'rokas-station-hover';
const MAP_ENDPOINT_LAYERS_V1 = ['rokas-walk-from', 'rokas-walk-to'];
const MAP_ENDPOINT_LAYERS_V2 = ['rokas-route-transfer-ending', 'rokas-route-stopover-circle'];
const FEATURE_SBB_ID_FIELD_NAME = 'sbb_id';

const STATION_SOURCE_CONFIG = {
  // OMT style
  omt: {
    source: 'base',
    sourceLayers: ['osm_points'],
  },
  // Shortbread style
  shortbread: {
    source: 'basemap',
    sourceLayers: ['generalized_points', 'public_transport'],
  },
};

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
        return FEATURE_SBB_ID_FIELD_NAME in f.properties;
      })
      .map(this._mapToFeature);

    if (!endpoints.length) {
      return [];
    }

    const config = this._getSourceConfig(map);
    return endpoints
      .map(
        (p) =>
          config.sourceLayers
            .flatMap((sourceLayer) =>
              map.querySourceFeatures(config.source, {
                sourceLayer,
                filter: [
                  'in',
                  FEATURE_SBB_ID_FIELD_NAME,
                  String(p.properties[FEATURE_SBB_ID_FIELD_NAME]),
                ],
              }),
            )
            .map((sourceFeature) => ({
              ...this._mapToFeature(sourceFeature),
              geometry: p.geometry, // get endpoint location not the tile source
            }))
            .pop(), // There might be multiple stations in the tile source
      )
      .filter((s) => s!!) as Feature[];
  }

  private _extractStationLayers(map: MaplibreMap): string[] | undefined {
    const config = this._getSourceConfig(map);
    return map
      .getStyle()
      .layers?.filter((layer: LayerSpecification) => {
        const sourceLayer = 'source-layer' in layer ? layer['source-layer'] : undefined;
        const id = layer.id;

        if (!sourceLayer) {
          return false;
        }

        if (config.sourceLayers.includes(sourceLayer)) {
          // Shortbread style
          if (sourceLayer === 'public_transport') {
            return id.startsWith('station') || id.startsWith('railstation');
          }
          // OMT & shortbread style
          return id !== sourceLayer;
        }

        // Older style
        if (sourceLayer === 'poi' && id.startsWith('station_ship')) {
          return true;
        }
        // Shortbread style
        return sourceLayer === 'aerialway_ski_stations' && id.startsWith('station');
      })
      .map((layer: LayerSpecification) => layer.id);
  }

  private _getSourceConfig(map: MaplibreMap): { source: string; sourceLayers: string[] } {
    return isShortbreadStyle(map) ? STATION_SOURCE_CONFIG.shortbread : STATION_SOURCE_CONFIG.omt;
  }

  private _mapToFeature(f: MapGeoJSONFeature) {
    return { type: f.type, properties: f.properties, geometry: f.geometry };
  }
}
