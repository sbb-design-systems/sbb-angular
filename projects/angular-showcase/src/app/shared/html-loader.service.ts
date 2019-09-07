import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Injectable()
export class HtmlLoader {
  constructor(private _http: HttpClient, private _renderer: Renderer2) {}

  loadDocumentation(
    route: ActivatedRoute,
    destroyable: Observable<void>,
    targetElement: ElementRef
  ) {
    this._loadHtml(
      route,
      destroyable,
      targetElement,
      (library, id) => `assets/docs/${library}/${id}.html`
    );
  }

  loadApiDocumentation(
    route: ActivatedRoute,
    destroyable: Observable<void>,
    targetElement: ElementRef
  ) {
    this._loadHtml(
      route,
      destroyable,
      targetElement,
      (library, id) => `assets/docs/api/${library}-${id}.html`
    );
  }

  loadExample(
    route: ActivatedRoute,
    destroyable: Observable<void>,
    targetElement: ElementRef,
    componentPortal: ComponentPortal<any>,
    type: 'html' | 'ts' | 'scss'
  ) {
    const component = componentPortal.component.name
      .replace(/Component$/, '.component')
      .replace(/^([A-Z])/, m => m.toLowerCase())
      .replace(/([A-Z])/g, m => `-${m.toLowerCase()}`);
    this._loadHtml(
      route,
      destroyable,
      targetElement,
      library => `assets/docs/${library}/examples/${component}.${type}.html`
    );
  }

  private _loadHtml(
    route: ActivatedRoute,
    destroyable: Observable<void>,
    targetElement: ElementRef,
    url: (library: string, id?: string) => string
  ) {
    combineLatest(route.params, route.data, (p, d) => ({ ...p, ...d }))
      .pipe(
        takeUntil(destroyable),
        switchMap(({ id, library }) => this._http.get(url(library, id), { responseType: 'text' }))
      )
      .subscribe(c => this._renderer.setProperty(targetElement.nativeElement, 'innerHTML', c));
  }
}
