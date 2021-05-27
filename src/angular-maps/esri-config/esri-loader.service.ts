import { Inject, Injectable, Optional } from '@angular/core';
import esriConfig from '@arcgis/core/config';

import { SBB_ESRI_CONFIG_TOKEN } from './esri-config.token';
import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriConfigConsts } from './esri-standard-values.const';

@Injectable({
  providedIn: 'root',
})
export class SbbEsriLoaderService {
  constructor(
    /** Inject an optional configuration to configure arcgis-js-api settings. */
    @Optional() @Inject(SBB_ESRI_CONFIG_TOKEN) private _config: SbbEsriConfiguration
  ) {
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

    const originsWithCredentials = SbbEsriConfigConsts.originsWithCredentialsReuqired;
    const originsWithCredentialsRequired = this._config?.originsWithCredentialsRequired
      ? originsWithCredentials.concat(this._config.originsWithCredentialsRequired)
      : originsWithCredentials;

    esriConfig.request.interceptors!.push({
      before: (params: any) => {
        if (originsWithCredentialsRequired.some((o) => params.url.includes(o))) {
          params.requestOptions.withCredentials = true;
        }
      },
      error: () => {},
    });
  }
}
