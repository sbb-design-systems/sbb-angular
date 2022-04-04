import { Injectable } from '@angular/core';

import { SbbMarker } from '../model/marker';

@Injectable({
  providedIn: 'root',
})
export class SbbTestData {
  createMarker(): SbbMarker {
    return {
      id: 'work',
      title: 'Office',
      position: [7.44645, 46.961409],
      category: 'WARNING',
    };
  }
}
