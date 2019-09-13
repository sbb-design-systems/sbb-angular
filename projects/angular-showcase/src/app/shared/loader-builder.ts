import { HttpClient } from '@angular/common/http';
import { ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';

export class LoaderBuilder {
  private _notifier: Observable<void>;
  private _urlBuilder: (library: string, id?: string) => string;

  constructor(
    private _http: HttpClient,
    private _renderer: Renderer2,
    private _route: ActivatedRoute
  ) {}

  until(notifier: Observable<void>) {
    this._notifier = notifier;
    return this;
  }

  from(urlBuilder: (library: string, id?: string) => string) {
    this._urlBuilder = urlBuilder;
    return this;
  }

  fromDocumentation() {
    return this.from((library, id) => `assets/docs/${library}/${id}.html`);
  }

  fromApiDocumentation() {
    return this.from((library, id) => `assets/docs/api/${library}-${id}.html`);
  }

  fromExamples(example: string, type: 'html' | 'ts' | 'scss') {
    return this.from(
      library => `assets/docs/${library}/examples/${example}.component.${type}.html`
    );
  }

  applyTo(targetElement: ElementRef) {
    return combineLatest(this._route.params, this._route.data, (p, d) => ({ ...p, ...d }))
      .pipe(
        takeUntil(this._notifier),
        switchMap(({ id, library }) =>
          this._http.get(this._urlBuilder(library, id), { responseType: 'text' })
        ),
        catchError(() => of(''))
      )
      .subscribe(c => this._renderer.setProperty(targetElement.nativeElement, 'innerHTML', c));
  }
}
