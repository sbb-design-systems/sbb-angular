import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CdnIcon {
  name: string;
  namespace: string;
  tags: string[];
}

export interface CdnIcons {
  version: string;
  icons: CdnIcon[];
}

@Injectable({
  providedIn: 'root',
})
export class CdnIconService {
  constructor(private _httpClient: HttpClient) {}

  loadAll(): Observable<CdnIcons> {
    return this._httpClient.get<CdnIcons>('https://icons.app.sbb.ch/index.json');
  }
}
