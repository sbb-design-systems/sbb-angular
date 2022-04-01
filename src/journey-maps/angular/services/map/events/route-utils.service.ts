import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';

import { FeatureData } from '../../../journey-maps-client.interfaces';
import { MapRoutesService } from '../map-routes.service';

import { MapEventUtilsService } from './map-event-utils.service';

export const ROUTE_ID_PROPERTY_NAME = 'routeId';

@Injectable({ providedIn: 'root' })
export class RouteUtilsService {
  constructor(private _mapEventUtils: MapEventUtilsService) {}

  filterRouteFeatures(currentFeatures: FeatureData[]): FeatureData[] {
    return currentFeatures.filter((hovered) => !!hovered.properties![ROUTE_ID_PROPERTY_NAME]);
  }

  /**
   * 'all' => find all routes in source |
   * 'visibleOnly' => find all routes in visible layer, means only current visible generalization
   * */
  findRelatedRoutes(
    routeFeature: Feature,
    mapInstance: MaplibreMap,
    find: 'all' | 'visibleOnly'
  ): FeatureData[] {
    const filter = this._createRelatedRoutesFilter(routeFeature);
    if (find === 'visibleOnly') {
      const layers = MapRoutesService.ALL_ROUTE_LAYERS;
      return this._mapEventUtils.queryVisibleFeaturesByFilter(mapInstance, 'ROUTE', layers, filter);
    } else {
      return this._mapEventUtils.queryFeatureSourceByFilter(mapInstance, 'ROUTE', filter);
    }
  }

  setRelatedRouteFeaturesSelection(mapInstance: MaplibreMap, feature: Feature, selected: boolean) {
    if (!feature.properties![ROUTE_ID_PROPERTY_NAME]) {
      return;
    }
    const relatedRouteFeatures = this.findRelatedRoutes(feature, mapInstance, 'all');
    if (!relatedRouteFeatures.length) {
      return;
    }
    for (const routeMapFeature of relatedRouteFeatures) {
      this._mapEventUtils.setFeatureState(routeMapFeature, mapInstance, { selected });
    }
  }

  private _createRelatedRoutesFilter(routeFeature: Feature): any[] {
    const routeId = routeFeature.properties![ROUTE_ID_PROPERTY_NAME];
    return ['all', ['==', ROUTE_ID_PROPERTY_NAME, routeId], ['!=', '$id', routeFeature.id ?? -1]];
  }
}
