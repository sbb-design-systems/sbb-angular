import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';

import { SbbEsriFeatureLayer, SbbEsriFeatureLayerInfoResponse } from '../esri-plugin.interface';

@Injectable({
  providedIn: 'root',
})
export class FeatureLayerService {
  private readonly WGS84_WKID = '4326';
  private readonly ARC_GIS_REQUEST_LIMIT = 1000;

  constructor(private http: HttpClient) {}

  getFeatureLayerConfig(
    featureLayer: SbbEsriFeatureLayer,
  ): Observable<SbbEsriFeatureLayerInfoResponse> {
    const requestUrl = new URL(featureLayer.url);
    requestUrl.searchParams.append('f', 'json');
    return this.http.get<SbbEsriFeatureLayerInfoResponse>(
      requestUrl.toString(),
      this.getAuthHeaders(featureLayer.accessToken),
    );
  }

  getFeatures(featurelayer: SbbEsriFeatureLayer): Observable<GeoJSON.Feature<GeoJSON.Geometry>[]> {
    let resultOffset = 0;
    return this.loadFeatures(featurelayer, 0).pipe(
      expand((response: any) => {
        if (response.exceededTransferLimit) {
          resultOffset = resultOffset + this.ARC_GIS_REQUEST_LIMIT;
          return this.loadFeatures(featurelayer, resultOffset);
        } else {
          return EMPTY;
        }
      }),
      map((collection: any) => {
        return collection.features ?? [];
      }),
      reduce((all, latest) => {
        return all.concat(latest);
      }, []),
    );
  }

  private getAuthHeaders(accessToken?: string) {
    return {
      headers: {
        'X-Esri-Authorization': `Bearer ${accessToken}`,
      },
    };
  }

  private loadFeatures(featureLayer: SbbEsriFeatureLayer, resultOffset: number): Observable<any> {
    const requestUrl = new URL(`${featureLayer.url}/query`);
    const searchParams = requestUrl.searchParams;
    searchParams.append('where', featureLayer.filter ?? '1=1');
    searchParams.append('resultOffset', resultOffset.toString());
    searchParams.append('f', 'geojson');
    searchParams.append('returnExceededLimitFeatures', 'true');
    searchParams.append('outSR', this.WGS84_WKID);
    searchParams.append('returnGeometry', 'true');
    return this.http.get(requestUrl.toString(), this.getAuthHeaders(featureLayer.accessToken));
  }
}
