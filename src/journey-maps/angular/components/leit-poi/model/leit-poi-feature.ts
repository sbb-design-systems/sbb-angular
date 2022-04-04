import { SbbLeitPoiPlacement } from '@sbb-esta/journey-maps/angular/components/leit-poi/model/leit-poi-placement';
import { LngLatLike } from 'maplibre-gl';

export interface SbbLeitPoiFeature {
  travelType: 'default' | 'stairs' | 'lift' | 'ramp' | 'escalator';
  travelDirection: 'default' | 'upstairs' | 'downstairs';
  placement: SbbLeitPoiPlacement;
  sourceLevel: number;
  location: LngLatLike;
  destinationLevel: number;
}
