import { Inject, Injectable, Optional } from '@angular/core';
import esriConfig from '@arcgis/core/config';

import { SBB_ESRI_CONFIG_TOKEN } from './esri-config.token';
import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriConfigConsts } from './esri-standard-values.const';

@Injectable({
  providedIn: 'root',
})
export class SbbEsriLoaderService {
  private _configuration: Promise<void>;

  constructor(
    /** Inject an optional configuration to configure arcgis-js-api settings. */
    @Optional() @Inject(SBB_ESRI_CONFIG_TOKEN) private _config: SbbEsriConfiguration
  ) {}

  /** @docs-private */
  private _configure(url: string) {
    const cssUrl = this._config?.cssUrl ?? SbbEsriConfigConsts.cssUrl;
    this._loadCss(cssUrl);
    esriConfig.portalUrl = this._config?.portalUrl ?? SbbEsriConfigConsts.arcgisPortalUrl;
    const trustedServers = this._config?.trustedServers ?? [];
    esriConfig.request.trustedServers!.push(
      ...SbbEsriConfigConsts.trustedServers.concat(trustedServers)
    );

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

  private _loadCss(url: string): void {
    // load script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
