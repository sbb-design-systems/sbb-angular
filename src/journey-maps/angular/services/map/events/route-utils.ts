import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import { FilterSpecification, Map as MaplibreMap } from 'maplibre-gl';

import { SbbFeatureData } from '../../../journey-maps.interfaces';
import { SbbMapRoutesService } from '../map-routes.service';

import { SbbMapEventUtils } from './map-event-utils';

export const SBB_ROUTE_ID_PROPERTY_NAME = 'routeId';
export const SBB_ROUTE_LINE_COLOR_PROPERTY_NAME = 'lineColor';

@Injectable({ providedIn: 'root' })
export class SbbRouteUtils {
  constructor(
    private _mapEventUtils: SbbMapEventUtils,
    private _mapRoutesService: SbbMapRoutesService,
  ) {}

  filterRouteFeatures(currentFeatures: SbbFeatureData[]): SbbFeatureData[] {
    return currentFeatures.filter((hovered) => !!hovered.properties![SBB_ROUTE_ID_PROPERTY_NAME]);
  }

  /**
   * 'all' => find all routes in source |
   * 'visibleOnly' => find all routes in visible layer, means only current visible generalization
   * */
  findRelatedRoutes(
    routeFeature: Feature,
    mapInstance: MaplibreMap,
    find: 'all' | 'visibleOnly',
  ): SbbFeatureData[] {
    const filter = this._createRelatedRoutesFilter(routeFeature);
    if (find === 'visibleOnly') {
      const layers = this._mapRoutesService.getRouteLayerIds(mapInstance);
      return this._mapEventUtils.queryVisibleFeaturesByFilter(mapInstance, 'ROUTE', layers, filter);
    } else {
      return this._mapEventUtils.queryFeatureSourceByFilter(mapInstance, 'ROUTE', filter);
    }
  }

  setRelatedRouteFeaturesSelection(mapInstance: MaplibreMap, feature: Feature, selected: boolean) {
    if (!feature.properties![SBB_ROUTE_ID_PROPERTY_NAME]) {
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

  private _createRelatedRoutesFilter(routeFeature: Feature): FilterSpecification {
    const routeId = routeFeature.properties![SBB_ROUTE_ID_PROPERTY_NAME];
    return [
      'all',
      ['==', SBB_ROUTE_ID_PROPERTY_NAME, routeId],
      ['!=', '$id', routeFeature.id ?? -1],
    ];
  }
}
