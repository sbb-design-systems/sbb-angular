import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';
import {MapEventUtilsService} from './map-event-utils.service';
import {Map as MaplibreMap} from 'maplibre-gl';
import {MapRoutesService} from '../map-routes.service';
import {Feature} from 'geojson';
import {Injectable} from '@angular/core';

export const ROUTE_ID_PROPERTY_NAME = 'routeId';

@Injectable({providedIn: 'root'})
export class RouteUtilsService {

  constructor(private mapEventUtils: MapEventUtilsService) {
  }

  filterRouteFeatures(currentFeatures: FeatureData[]): FeatureData[] {
    return currentFeatures.filter(hovered => !!hovered.properties[ROUTE_ID_PROPERTY_NAME]);
  }

  /**
   * 'all' => find all routes in source |
   * 'visibleOnly' => find all routes in visible layer, means only current visible generalization
   * */
  findRelatedRoutes(routeFeature: Feature, mapInstance: MaplibreMap, find: 'all' | 'visibleOnly'): FeatureData[] {
    const filter = this.createRelatedRoutesFilter(routeFeature);
    if (find === 'visibleOnly') {
      const layers = MapRoutesService.allRouteLayers;
      return this.mapEventUtils.queryVisibleFeaturesByFilter(mapInstance, FeatureDataType.ROUTE, layers, filter);
    } else {
      return this.mapEventUtils.queryFeatureSourceByFilter(mapInstance, FeatureDataType.ROUTE, filter);
    }
  }

  setRelatedRouteFeaturesSelection(mapInstance: MaplibreMap, feature: Feature, selected: boolean) {
    if (!feature.properties[ROUTE_ID_PROPERTY_NAME]) {
      return;
    }
    const relatedRouteFeatures = this.findRelatedRoutes(feature, mapInstance, 'all');
    if (!relatedRouteFeatures.length) {
      return;
    }
    for (let routeMapFeature of relatedRouteFeatures) {
      this.mapEventUtils.setFeatureState(routeMapFeature, mapInstance, {selected});
    }
  }

  private createRelatedRoutesFilter(routeFeature: Feature): any[] {
    const routeId = routeFeature.properties[ROUTE_ID_PROPERTY_NAME];
    return [
      'all',
      ['==', ROUTE_ID_PROPERTY_NAME, routeId],
      ['!=', '$id', routeFeature.id ?? -1]
    ];
  }
}
