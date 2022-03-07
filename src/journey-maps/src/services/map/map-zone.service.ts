import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';
import {EMPTY_FEATURE_COLLECTION} from './map.service';
import {GeoJSON} from 'geojson';
import {MapSelectionEventService} from './events/map-selection-event.service';
import {FeatureDataType} from '../../journey-maps-client.interfaces';

@Injectable({providedIn: 'root'})
export class MapZoneService {

  static allZoneLayers: string[] = [
    'rokas-zone',
    'rokas-zone-outline',
    'rokas-zone-label',
  ];

  updateZones(map: MaplibreMap, mapSelectionEventService: MapSelectionEventService, zonesFeatureCollection: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION): void {
    const source = map.getSource(Constants.ZONE_SOURCE) as GeoJSONSource;
    source.setData(zonesFeatureCollection);

    map.removeFeatureState({source: Constants.ZONE_SOURCE})

    if (zonesFeatureCollection.features?.length) {
      map.once('idle', () => {
        mapSelectionEventService.initSelectedState(map, zonesFeatureCollection.features, FeatureDataType.ZONE)
      });
    }
  }
}
