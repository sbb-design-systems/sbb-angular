import { Injectable } from '@angular/core';

import { SbbPointsOfInterestEnvironmentType } from '../../journey-maps.interfaces';

@Injectable({ providedIn: 'root' })
export class SbbMapUrlService {
  getPoiSourceUrlByEnvironment(
    url: string,
    poiEnvironment?: SbbPointsOfInterestEnvironmentType
  ): string {
    if (poiEnvironment === 'int') {
      // Set poi source to integration if needed
      return url.replace('journey_pois', 'journey_pois_integration');
    } else if (poiEnvironment === 'prod') {
      // Reset poi source to prod if needed
      return url.replace('_integration', '');
    }

    return url;
  }
}
