import { Injectable } from '@angular/core';

import {
  SbbPointsOfInterestEnvironmentType,
  SbbPointsOfInterestOptions,
} from '../../journey-maps.interfaces';

const URL_SPLITTER = '.json';

@Injectable({ providedIn: 'root' })
export class SbbMapUrlService {
  getPoiSourceUrlByOptions(url: string, options?: SbbPointsOfInterestOptions): string {
    const [urlStart, urlEnd] = url.split(URL_SPLITTER);
    let newUrlStart = urlStart.replace('_integration', '').replace('_preview', '');

    newUrlStart = this._setPreview(newUrlStart, options?.includePreview);
    newUrlStart = this._setEnvironment(newUrlStart, options?.environment);

    return newUrlStart + URL_SPLITTER + urlEnd;
  }

  private _setPreview(url: string, includePreview?: boolean): string {
    if (includePreview) {
      return url + '_preview';
    }
    return url;
  }

  private _setEnvironment(url: string, environment?: SbbPointsOfInterestEnvironmentType): string {
    if (environment === 'int') {
      return url + '_integration';
    }
    return url;
  }
}
