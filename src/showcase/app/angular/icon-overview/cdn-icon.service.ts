import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CdnIcon {
  name: string;
  namespace: string | null;
  tags: Array<string | null>;
}

interface CdnIconsResponse {
  version: string;
  icons: CdnIcon[];
}

interface CdnPictogramsResponse {
  version: string;
  pictograms: CdnIcon[];
}

export interface CdnIcons {
  deprecatedVersion: string;
  iconVersion: string;
  pictoVersion: string;
  icons: CdnIcon[];
}

@Injectable({
  providedIn: 'root',
})
export class CdnIconService {
  constructor(private _httpClient: HttpClient) {}

  loadDeprecated(): Observable<CdnIconsResponse> {
    return this._httpClient.get<CdnIconsResponse>('https://icons.app.sbb.ch/index.json');
  }

  loadIcons(): Observable<CdnIconsResponse> {
    return this._httpClient.get<CdnIconsResponse>('https://icons.app.sbb.ch/icons/index.json');
  }

  loadPictos(): Observable<CdnIconsResponse> {
    return this._httpClient
      .get<CdnPictogramsResponse>('https://icons.app.sbb.ch/pictograms/index.json')
      .pipe(
        map((res) => ({
          icons: res.pictograms.map((icon) => ({ namespace: 'pictograms', ...icon })),
          version: res.version,
        }))
      );
  }
}
