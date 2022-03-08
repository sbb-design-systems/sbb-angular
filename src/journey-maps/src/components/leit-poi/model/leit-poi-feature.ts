import { LngLatLike } from 'maplibre-gl';

import { LeitPoiPlacement } from './leit-poi-placement';
import { LeitPoiTravelDirection } from './leit-poi-travel-direction';
import { LeitPoiTravelType } from './leit-poi-travel-type';

export interface LeitPoiFeature {
  travelType: LeitPoiTravelType;
  travelDirection: LeitPoiTravelDirection;
  placement: LeitPoiPlacement;
  sourceLevel: number;
  location: LngLatLike;
  destinationLevel: number;
}
