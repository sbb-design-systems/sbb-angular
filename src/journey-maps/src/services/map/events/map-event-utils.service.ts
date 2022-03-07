import {Map as MaplibreMap, MapboxGeoJSONFeature} from 'maplibre-gl';
import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';
import {Constants} from '../../constants';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MapEventUtilsService {

  queryFeaturesByLayerIds(mapInstance: MaplibreMap, screenPoint: [number, number], layers: Map<string, FeatureDataType>): FeatureData[] {
    return mapInstance.queryRenderedFeatures(screenPoint, {
      layers: [...layers.keys()]
    }).map(f => MapEventUtilsService.toFeatureEventData(f, layers.get(f.layer.id)));
  }

  /**
   * Query feature in all visible layers in the layers list. Only features that are currently rendered are included.
   */
  queryVisibleFeaturesByFilter(mapInstance: MaplibreMap, featureDataType: FeatureDataType, layers: string[], filter?: any[]): FeatureData[] {
    return mapInstance.queryRenderedFeatures(null, {layers, filter})
      .map(f => MapEventUtilsService.toFeatureEventData(f, featureDataType));
  }

  /**
   *  WARNING: This function does not check features outside the currently visible viewport.
   *  In opposite to queryVisibleFeaturesByFilter, it includes all features: currently rendered or hidden by layer zoom-level or visibility.
   */
  queryFeatureSourceByFilter(mapInstance: MaplibreMap, featureDataType: FeatureDataType, filter?: any[]): FeatureData[] {
    const sourceId = MapEventUtilsService.getSourceMapping(featureDataType);
    if (!sourceId) {
      throw new Error('Missing source mapping for feature type: ' + featureDataType);
    }
    return mapInstance.querySourceFeatures(sourceId, {filter})
      .map(f => {
        const data = MapEventUtilsService.toFeatureEventData(f, featureDataType);
        if (!data.source) {
          data.source = sourceId;
        }
        return data;
      });
  }

  setFeatureState(mapFeature: MapboxGeoJSONFeature, mapInstance: MaplibreMap, state: any) {
    /* This part is important:
    - get fresh feature state instance from map source
    - override the input feature state -> keep in sync
    - Finally set the new state in map source.
    */
    if (!mapFeature.source) {
      throw new Error('Missing source id in feature: ' + mapFeature);
    }
    mapFeature.state = mapInstance.getFeatureState(mapFeature);
    mapFeature.state = Object.assign(mapFeature.state, state);
    mapInstance.setFeatureState(mapFeature, mapFeature.state);
  }

  queryFeaturesByProperty(
    mapInstance: MaplibreMap,
    layers: Map<string, FeatureDataType>,
    propertyFilter: (value: MapboxGeoJSONFeature) => boolean
  ): FeatureData[] {
    return mapInstance.queryRenderedFeatures(null, {
      layers: [...layers.keys()]
    }).filter(propertyFilter).map(f => MapEventUtilsService.toFeatureEventData(f, layers.get(f.layer.id)));
  }

  filterFeaturesByPriority(features: FeatureData[]): FeatureData[] {
    // Click priority: points, lines/multiline, polygons/others
    if (!features || !features.length) {
      return features;
    }

    const points = features.filter(f => f.geometry.type.includes('Point'));
    const lines = features.filter(f => f.geometry.type.includes('Line'));
    if (points.length) {
      features = points;
    } else if (lines.length) {
      features = lines;
    }

    return features;
  }

  /* private functions */
  private static toFeatureEventData(feature: MapboxGeoJSONFeature, featureDataType: FeatureDataType): FeatureData {
    return {
      featureDataType,
      // feature geometry is a getter function, so do map manually:
      geometry: feature.geometry,
      ...feature
    };
  }

  private static getSourceMapping(featureDataType: FeatureDataType): string {
    switch (featureDataType) {
      case FeatureDataType.MARKER:
        return Constants.MARKER_SOURCE;
      case FeatureDataType.ROUTE:
        return Constants.ROUTE_SOURCE;
      case FeatureDataType.ZONE:
        return Constants.ZONE_SOURCE;
      default:
        return undefined;
    }
  }
}
