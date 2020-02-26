import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoaderBuilder } from './loader-builder';

@Injectable({
  providedIn: 'root'
})
export class HtmlLoader {
  constructor(private _http: HttpClient) {}

  with(route: ActivatedRoute) {
    return new LoaderBuilder(this._http, route);
  }
}
