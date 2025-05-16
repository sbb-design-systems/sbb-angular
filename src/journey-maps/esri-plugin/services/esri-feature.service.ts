import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { expand, map, reduce } from 'rxjs/operators';

import {
  SbbEsriConfig,
  SbbEsriError,
  SbbEsriFeatureLayer,
  SbbEsriFeatureResponse,
} from '../esri-plugin.interface';

@Injectable({
  providedIn: 'root',
})
export class EsriFeatureService {
  private readonly WGS84_WKID = '4326';
  private readonly ARC_GIS_REQUEST_LIMIT = 1000;

  constructor(private _httpClient: HttpClient) {}

  getLayerConfig(featureLayer: SbbEsriFeatureLayer): Observable<SbbEsriConfig | undefined> {
    const formData = new FormData();
    formData.append('f', 'json');

    return this._httpClient
      .post<
        SbbEsriConfig | SbbEsriError
      >(featureLayer.url, formData, this._getAuthParams(featureLayer.accessToken))
      .pipe(
        map((config) => {
          if (this._isEsriError(config)) {
            console.error(
              `Failed to call service ${featureLayer.url} (error: ${JSON.stringify(config)}))`,
            );
            return undefined;
          }
          return config as SbbEsriConfig;
        }),
      );
  }

  getFeatures(featurelayer: SbbEsriFeatureLayer): Observable<GeoJSON.Feature<GeoJSON.Geometry>[]> {
    let resultOffset = 0;
    return this._loadFeatures(featurelayer, resultOffset).pipe(
      expand((response: any) => {
        if (!response.exceededTransferLimit) {
          return EMPTY;
        }
        resultOffset = resultOffset + this.ARC_GIS_REQUEST_LIMIT;
        return this._loadFeatures(featurelayer, resultOffset);
      }),
      map((collection) => {
        return collection.features ?? [];
      }),
      reduce((all, latest) => {
        return all.concat(latest);
      }, [] as GeoJSON.Feature<GeoJSON.Geometry>[]),
    );
  }

  private _loadFeatures(
    featureLayer: SbbEsriFeatureLayer,
    resultOffset: number,
  ): Observable<SbbEsriFeatureResponse> {
    const requestUrl = `${featureLayer.url}/query`;

    const formData = new FormData();
    formData.append('f', 'geojson');
    formData.append('where', featureLayer.filter ?? '1=1');
    formData.append('resultOffset', resultOffset.toString());
    formData.append('returnExceededLimitFeatures', 'true');
    formData.append('outSR', this.WGS84_WKID);
    formData.append('returnGeometry', 'true');
    formData.append('outfields', '*');
    return this._httpClient.post<SbbEsriFeatureResponse>(
      requestUrl,
      formData,
      this._getAuthParams(featureLayer.accessToken),
    );
  }

  private _getAuthParams(accessToken?: string) {
    if (!accessToken) {
      return;
    }
    return {
      params: {
        token: `${accessToken}`,
      },
    };
  }

  private _isEsriError(value: any): boolean {
    if (!('error' in value)) {
      return false;
    }
    const error = value.error;
    return 'code' in error && 'message' in error;
  }
}
