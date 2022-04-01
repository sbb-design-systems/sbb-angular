import { Injectable } from '@angular/core';

import { Marker } from '../model/marker';

@Injectable({
  providedIn: 'root',
})
export class TestDataService {
  createMarker(): Marker {
    return {
      id: 'work',
      title: 'Office',
      position: [7.44645, 46.961409],
      category: 'WARNING',
    };
  }
}
