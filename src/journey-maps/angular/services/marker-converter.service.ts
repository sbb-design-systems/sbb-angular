import { Injectable } from '@angular/core';
import { Feature } from 'geojson';

import { Marker } from '../model/marker';

@Injectable({
  providedIn: 'root',
})
export class MarkerConverterService {
  convertToFeature(marker: Marker): Feature {
    (marker as any).marker_type = 'sbb-marker'; // Activate new markers, remove when old markers are no more.
    return {
      geometry: {
        type: 'Point',
        coordinates: marker.position,
      },
      type: 'Feature',
      properties: { ...marker },
    };
  }
}
