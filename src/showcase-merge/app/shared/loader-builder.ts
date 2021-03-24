import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export class LoaderBuilder {
  private _urlBuilder: (packageName: string, id?: string) => string;

  constructor(private _http: HttpClient, private _route: ActivatedRoute) {}

  from(urlBuilder: (packageName: string, id?: string) => string) {
    this._urlBuilder = urlBuilder;
    return this;
  }

  fromDocumentation() {
    return this.from(
      (packageName, id) => `assets/docs-content/overviews/${packageName}/${id}.html`
    );
  }

  fromModuleDocumentation() {
    return this.from(
      (packageName, id) => `assets/docs-content/overviews/${packageName}/${id}/${id}.html`
    );
  }

  fromApiDocumentation() {
    return this.from((packageName, id) => `assets/docs-content/api-docs/${packageName}-${id}.html`);
  }

  fromExamples(example: string, type: 'html' | 'ts' | 'css') {
    return this.from(
      (packageName, id) =>
        `assets/docs-content/examples-highlighted/${packageName}/${id}/${example}/${example}-example-${type}.html`
    );
  }

  fromSourceExamples(example: string, type: 'html' | 'ts' | 'css') {
    return this.from(
      (packageName, id) =>
        `assets/docs-content/examples-source/${packageName}/${id}/${example}/${example}-example.${type}`
    );
  }

  observe(): Observable<string> {
    return combineLatest([this._route.params, this._route.data]).pipe(
      map(([p, d]) => ({ ...p, ...d })),
      switchMap(({ id, packageName }) =>
        this._http
          .get(this._urlBuilder(packageName, id), { responseType: 'text' })
          .pipe(catchError(() => of('')))
      )
    );
  }
}
