import { Injectable } from '@angular/core';
import esriConfig from '@arcgis/core/config';

import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriConfigConsts } from './esri-standard-values.const';

@Injectable({
  providedIn: 'root',
})
export class SbbEsriLoaderService {
  constructor(private _config: SbbEsriConfiguration) {
    this._configure();
  }

  /** @docs-private */
  private _configure() {
    esriConfig.portalUrl = this._config?.portalUrl ?? SbbEsriConfigConsts.arcgisPortalUrl;

    const trustedServers = this._config?.trustedServers ?? [];
    const esriConfigTrustedServers = esriConfig.request.trustedServers!;
    SbbEsriConfigConsts.trustedServers.concat(trustedServers).forEach((srv) => {
      if (esriConfigTrustedServers.indexOf(srv) === -1) {
        esriConfigTrustedServers.push(srv);
      }
    });
  }
}
