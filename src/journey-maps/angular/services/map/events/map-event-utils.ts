import { Injectable } from '@angular/core';
import { FilterSpecification, Map as MaplibreMap, MapGeoJSONFeature } from 'maplibre-gl';

import { SbbFeatureData, SbbFeatureDataType } from '../../../journey-maps.interfaces';
import {
  SBB_ROKAS_MARKER_SOURCE,
  SBB_ROKAS_ROUTE_SOURCE,
  SBB_ROKAS_ZONE_SOURCE,
} from '../../constants';

@Injectable({ providedIn: 'root' })
export class SbbMapEventUtils {
  queryFeaturesByLayerIds(
    mapInstance: MaplibreMap,
    screenPoint: [number, number],
    layers: Map<string, SbbFeatureDataType>,
  ): SbbFeatureData[] {
    return mapInstance
      .queryRenderedFeatures(screenPoint, {
        layers: [...layers.keys()],
      })
      .map((f) => SbbMapEventUtils._toFeatureEventData(f, layers.get(f.layer.id)!));
  }

  /**
   * Query feature in all visible layers in the layers list. Only features that are currently rendered are included.
   */
  queryVisibleFeaturesByFilter(
    mapInstance: MaplibreMap,
    featureDataType: SbbFeatureDataType,
    layers: string[],
    filter?: FilterSpecification,
  ): SbbFeatureData[] {
    return mapInstance
      .queryRenderedFeatures(undefined, { layers, filter })
      .map((f) => SbbMapEventUtils._toFeatureEventData(f, featureDataType));
  }

  /**
   *  WARNING: This function does not check features outside the currently visible viewport.
   *  In opposite to queryVisibleFeaturesByFilter, it includes all features: currently rendered or hidden by layer zoom-level or visibility.
   */
  queryFeatureSourceByFilter(
    mapInstance: MaplibreMap,
    featureDataType: SbbFeatureDataType,
    filter?: FilterSpecification,
  ): SbbFeatureData[] {
    const sourceId = SbbMapEventUtils._getSourceMapping(featureDataType);
    if (!sourceId) {
      throw new Error('Missing source mapping for feature type: ' + featureDataType);
    }
    return mapInstance
      .querySourceFeatures(sourceId, filter ? { sourceLayer: 'ignored', filter } : undefined)
      .map((f) => {
        const data = SbbMapEventUtils._toFeatureEventData(f, featureDataType);
        if (!data.source) {
          data.source = sourceId;
        }
        return data;
      });
  }

  setFeatureState(mapFeature: MapGeoJSONFeature, mapInstance: MaplibreMap, state: any) {
    /* This part is important:
    - get fresh feature state instance from map source
    - override the input feature state -> keep in sync
    - Finally set the new state in map source.
    */
    if (!mapFeature.source) {
      throw new Error(`Missing source id in feature: ${mapFeature}`);
    }

    mapFeature.state = {
      ...mapInstance.getFeatureState(mapFeature),
      ...state,
    };

    mapInstance.setFeatureState(mapFeature, mapFeature.state);
  }

  queryFeaturesByProperty(
    mapInstance: MaplibreMap,
    layers: Map<string, SbbFeatureDataType>,
    propertyFilter: (value: MapGeoJSONFeature) => boolean,
  ): SbbFeatureData[] {
    return mapInstance
      .queryRenderedFeatures(undefined, {
        layers: [...layers.keys()],
      })
      .filter(propertyFilter)
      .map((f) => SbbMapEventUtils._toFeatureEventData(f, layers.get(f.layer.id)!));
  }

  filterFeaturesByPriority(features: SbbFeatureData[]): SbbFeatureData[] {
    // Click priority: points, lines/multiline, polygons/others
    if (!features || !features.length) {
      return features;
    }

    const points = features.filter((f) => f.geometry.type.includes('Point'));
    const lines = features.filter((f) => f.geometry.type.includes('Line'));
    if (points.length) {
      features = points;
    } else if (lines.length) {
      features = lines;
    }

    return features;
  }

  /* private functions */
  private static _toFeatureEventData(
    feature: MapGeoJSONFeature,
    featureDataType: SbbFeatureDataType,
  ): SbbFeatureData {
    return {
      featureDataType,
      // @ts-ignore - feature geometry is a getter function, so we must do map manually:
      geometry: feature.geometry,
      ...feature,
      toJSON: () => {
        throw new Error('not implemented');
      },
    };
  }

  private static _getSourceMapping(featureDataType: SbbFeatureDataType): string | undefined {
    switch (featureDataType) {
      case 'MARKER':
        return SBB_ROKAS_MARKER_SOURCE;
      case 'ROUTE':
        return SBB_ROKAS_ROUTE_SOURCE;
      case 'ZONE':
        return SBB_ROKAS_ZONE_SOURCE;
      default:
        return undefined;
    }
  }
}
