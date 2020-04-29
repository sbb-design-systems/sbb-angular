import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export class LoaderBuilder {
  private _urlBuilder: (library: string, id?: string) => string;

  constructor(private _http: HttpClient, private _route: ActivatedRoute) {}

  from(urlBuilder: (library: string, id?: string) => string) {
    this._urlBuilder = urlBuilder;
    return this;
  }

  fromDocumentation() {
    return this.from((library, id) => `assets/docs-content/overviews/${library}/${id}.html`);
  }

  fromModuleDocumentation() {
    return this.from((library, id) => `assets/docs-content/overviews/${library}/${id}/${id}.html`);
  }

  fromApiDocumentation() {
    return this.from((library, id) => `assets/docs-content/api-docs/angular-${library}-${id}.html`);
  }

  fromExamples(example: string, type: 'html' | 'ts' | 'scss') {
    return this.from(
      (library, id) =>
        `assets/docs-content/examples-highlighted/app/${library}/${library}-examples/${id}-examples/${example}/${example}.component-${type}.html`
    );
  }

  observe(): Observable<string> {
    return combineLatest([this._route.params, this._route.data]).pipe(
      map(([p, d]) => ({ ...p, ...d })),
      switchMap(({ id, library }) =>
        this._http.get(this._urlBuilder(library, id), { responseType: 'text' })
      ),
      catchError(() => of(''))
    );
  }
}
