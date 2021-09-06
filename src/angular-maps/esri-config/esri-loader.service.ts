import { Injectable } from '@angular/core';
import esriConfig from '@arcgis/core/config';

import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriConfigConsts } from './esri-standard-values.const';

@Injectable({
  providedIn: 'root',
})
export class SbbEsriLoaderService {
  /** @docs-private */
  public static configure(config: SbbEsriConfiguration): SbbEsriLoaderService {
    esriConfig.portalUrl = config?.portalUrl ?? SbbEsriConfigConsts.arcgisPortalUrl;

    const trustedServers = config?.trustedServers ?? [];
    const esriConfigTrustedServers = esriConfig.request.trustedServers!;
    SbbEsriConfigConsts.trustedServers.concat(trustedServers).forEach((srv) => {
      if (esriConfigTrustedServers.indexOf(srv) === -1) {
        esriConfigTrustedServers.push(srv);
      }
    });
    return this;
  }
}
