import {Injectable} from '@angular/core';
import {Marker} from '../model/marker';
import {Feature} from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class MarkerConverterService {

  convertToFeature(marker: Marker): Feature {
    (marker as any).marker_type = 'sbb-marker'; // Activate new markers, remove when old markers are no more.
    return {
      geometry: {
        type: 'Point',
        coordinates: marker.position
      },
      type: 'Feature',
      properties: {...marker}
    };
  }
}
