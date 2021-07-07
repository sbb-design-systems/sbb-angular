import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoaderBuilder } from './loader-builder';
import { ModuleParams } from './module-params';

@Injectable({
  providedIn: 'root',
})
export class HtmlLoader {
  constructor(private _http: HttpClient) {}

  withParams(moduleParams: ModuleParams): LoaderBuilder {
    return new LoaderBuilder(this._http, moduleParams);
  }
}
