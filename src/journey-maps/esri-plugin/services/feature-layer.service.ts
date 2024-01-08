import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';

import {
  SbbEsriConfig,
  SbbEsriError,
  SbbEsriFeatureLayer,
  SbbEsriFeatureResponse,
} from '../esri-plugin.interface';

@Injectable({
  providedIn: 'root',
})
export class FeatureLayerService {
  private readonly WGS84_WKID = '4326';
  private readonly ARC_GIS_REQUEST_LIMIT = 1000;

  constructor(private _httpClient: HttpClient) {}

  getFeatureLayerConfig(featureLayer: SbbEsriFeatureLayer): Observable<SbbEsriConfig> {
    const formData = new FormData();
    formData.append('f', 'json');

    return this._httpClient
      .post<SbbEsriConfig | SbbEsriError>(
        featureLayer.url,
        formData,
        this._getAuthHeaders(featureLayer.accessToken),
      )
      .pipe(
        map((config) => {
          if (config instanceof SbbEsriError) {
            throw new Error(`Failed to call service ${featureLayer.url} (error: ${config}))`);
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

  private _getAuthHeaders(accessToken?: string) {
    if (!accessToken) {
      return;
    }
    return {
      headers: {
        'X-Esri-Authorization': `Bearer ${accessToken}`,
      },
    };
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

    return this._httpClient.post<SbbEsriFeatureResponse>(
      requestUrl,
      formData,
      this._getAuthHeaders(featureLayer.accessToken),
    );
  }
}
