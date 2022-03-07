import {Injectable} from '@angular/core';
import {EMPTY_FEATURE_COLLECTION} from './map.service';
import {MapRouteService} from './map-route.service';
import {Map as MaplibreMap} from 'maplibre-gl';
import {ROUTE_ID_PROPERTY_NAME} from './events/route-utils.service';
import {SelectableFeatureCollection} from '../../journey-maps-client.interfaces';
import {MapSelectionEventService, SELECTED_PROPERTY_NAME} from './events/map-selection-event.service';

@Injectable({providedIn: 'root'})
export class MapRoutesService {

  static allRouteLayers: string[] = [
    'rokas-route',
    'rokas-route-gen0',
    'rokas-route-gen1',
    'rokas-route-gen2',
    'rokas-route-gen3',
    'rokas-route-gen4'
  ];

  constructor(private mapRouteService: MapRouteService) {
  }

  updateRoutes(map: MaplibreMap, mapSelectionEventService: MapSelectionEventService, routes: SelectableFeatureCollection[] = [EMPTY_FEATURE_COLLECTION]): void {
    routes.forEach((featureCollection, idx) => {
      const id = featureCollection.id ?? `jmc-generated-${idx + 1}`;
      for (const feature of featureCollection.features) {
        feature.properties[ROUTE_ID_PROPERTY_NAME] = id;
        feature.properties[SELECTED_PROPERTY_NAME] = featureCollection.isSelected;
      }
    });
    this.mapRouteService.updateRoute(map, mapSelectionEventService, {
      type: 'FeatureCollection',
      // With ES2019 we can replace this with routes.flatMap(({features}) => features)
      features: routes.reduce((accumulatedFeatures, next) => accumulatedFeatures.concat(next.features), []),
    });
  }
}
