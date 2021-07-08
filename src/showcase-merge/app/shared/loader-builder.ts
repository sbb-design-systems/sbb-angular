import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ModuleParams } from './module-params';

export class LoaderBuilder {
  private _url: string;
  private readonly _packageName: string;
  private readonly _id: string;

  constructor(private _http: HttpClient, params: ModuleParams) {
    this._packageName = params.packageName;
    this._id = params.id;
  }

  fromDocumentation() {
    this._url = `assets/docs-content/overviews/${this._packageName}/${this._id}.html`;
    return this;
  }

  fromModuleDocumentation() {
    this._url = `assets/docs-content/overviews/${this._packageName}/${this._id}/${this._id}.html`;
    return this;
  }

  fromApiDocumentation() {
    this._url = `assets/docs-content/api-docs/${this._packageName}-${this._id}.html`;
    return this;
  }

  fromExamples(example: string, type: 'html' | 'ts' | 'css') {
    this._url = `assets/docs-content/examples-highlighted/${this._packageName}/${this._id}/${example}/${example}-example-${type}.html`;
    return this;
  }

  fromSourceExamples(example: string, type: 'html' | 'ts' | 'css') {
    this._url = `assets/docs-content/examples-source/${this._packageName}/${this._id}/${example}/${example}-example.${type}`;
    return this;
  }

  load(): Observable<string> {
    return this._http.get(this._url, { responseType: 'text' }).pipe(catchError(() => of('')));
  }
}
