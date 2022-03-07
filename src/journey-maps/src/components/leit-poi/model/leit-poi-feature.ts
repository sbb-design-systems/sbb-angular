import {LeitPoiTravelType} from './leit-poi-travel-type';
import {LeitPoiTravelDirection} from './leit-poi-travel-direction';
import {LeitPoiPlacement} from './leit-poi-placement';
import {LngLatLike} from 'maplibre-gl';

export interface LeitPoiFeature {
  travelType: LeitPoiTravelType;
  travelDirection: LeitPoiTravelDirection;
  placement: LeitPoiPlacement;
  sourceLevel: number;
  location: LngLatLike;
  destinationLevel: number;
}
