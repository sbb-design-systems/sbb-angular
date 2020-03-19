import { Inject, Injectable, Optional } from '@angular/core';
import * as esriLoader from 'esri-loader';

import { ESRI_CONFIG_TOKEN } from '../esri-config/esri-config.token';
import { EsriConfiguration } from '../esri-config/esri-configuration';
import { EsriConfigConsts } from '../esri-config/esri-standard-values.const';

@Injectable({
  providedIn: 'root'
})
export class EsriLoaderService {
  private _configuration: Promise<void>;

  constructor(
    /** Inject an optional configuration to configure arcgis-js-api settings. */
    @Optional() @Inject(ESRI_CONFIG_TOKEN) private _config: EsriConfiguration
  ) {}

  /**
   * Loads up to twelve specified ESRI-modules and returns it's constructors.
   */
  load<T>(esriModules: string[]): Promise<[T]>;
  load<T1, T2>(esriModules: string[]): Promise<[T1, T2]>;
  load<T1, T2, T3>(esriModules: string[]): Promise<[T1, T2, T3]>;
  load<T1, T2, T3, T4>(esriModules: string[]): Promise<[T1, T2, T3, T4]>;
  load<T1, T2, T3, T4, T5>(esriModules: string[]): Promise<[T1, T2, T3, T4, T5]>;
  load<T1, T2, T3, T4, T5, T6>(esriModules: string[]): Promise<[T1, T2, T3, T4, T5, T6]>;
  load<T1, T2, T3, T4, T5, T6, T7>(esriModules: string[]): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
  load<T1, T2, T3, T4, T5, T6, T7, T8>(
    esriModules: string[]
  ): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
  load<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    esriModules: string[]
  ): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
  load<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    esriModules: string[]
  ): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
  load<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
    esriModules: string[]
  ): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11]>;
  load<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
    esriModules: string[]
  ): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12]>;
  async load(esriModules: string[]): Promise<any[]> {
    const url =
      this._config && this._config.arcgisJsUrl
        ? this._config.arcgisJsUrl
        : EsriConfigConsts.arcgisJsUrl;

    if (!this._configuration) {
      this._configuration = this._configure(url);
    }

    await this._configuration;
    return await esriLoader.loadModules(esriModules, { url });
  }

  /** @docs-private */
  private async _configure(url: string) {
    const cssUrl =
      this._config && this._config.cssUrl ? this._config.cssUrl : EsriConfigConsts.cssUrl;
    esriLoader.loadCss(cssUrl);

    const configModule = await esriLoader.loadModules(['esri/config'], { url });
    const esriConfig = configModule[0] as __esri.config;

    esriConfig.portalUrl = EsriConfigConsts.arcgisPortalUrl;
    if (this._config && this._config.portalUrl) {
      esriConfig.portalUrl = this._config.portalUrl;
    }

    const trustedServers =
      this._config && this._config.trustedServers ? this._config.trustedServers : [];
    esriConfig.request.trustedServers!.push(
      ...EsriConfigConsts.trustedServers.concat(trustedServers)
    );

    const originsWithCredentials = EsriConfigConsts.originsWithCredentialsReuqired;
    const originsWithCredentialsRequired =
      this._config && this._config.originsWithCredentialsRequired
        ? originsWithCredentials.concat(this._config.originsWithCredentialsRequired)
        : originsWithCredentials;

    esriConfig.request.interceptors!.push({
      before: (params: any) => {
        if (originsWithCredentialsRequired.some(o => params.url.includes(o))) {
          params.requestOptions.withCredentials = true;
        }
      },
      error: () => {}
    });
  }
}
