import { LngLatLike } from 'maplibre-gl';

import { SbbLeitPoiPlacement } from './leit-poi-placement';

export interface SbbLeitPoiFeature {
  travelType: 'default' | 'stairs' | 'lift' | 'ramp' | 'escalator';
  travelDirection: 'default' | 'upstairs' | 'downstairs';
  placement: SbbLeitPoiPlacement;
  sourceLevel: number;
  location: LngLatLike;
  destinationLevel: number;
}
