import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';
import {EMPTY_FEATURE_COLLECTION} from './map.service';
import {MapSelectionEventService} from './events/map-selection-event.service';
import {FeatureDataType} from '../../journey-maps-client.interfaces';

@Injectable({providedIn: 'root'})
export class MapRouteService {

  updateRoute(map: MaplibreMap, mapSelectionEventService: MapSelectionEventService,
              routeFeatureCollection: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION
  ): void {
    const source = map.getSource(Constants.ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
    map.removeFeatureState({source: Constants.ROUTE_SOURCE})
    if (routeFeatureCollection.features?.length) {
      map.once('idle', () => mapSelectionEventService.initSelectedState(map, routeFeatureCollection.features, FeatureDataType.ROUTE));
    }
  }
}
