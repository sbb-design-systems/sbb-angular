import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, Directive, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, skip, takeUntil } from 'rxjs/operators';

import { ExampleProvider } from './example-provider';
import { HtmlLoader } from './html-loader.service';

@Directive()
export class ComponentViewerBase implements OnInit, AfterViewInit, OnDestroy {
  tabs: { openTabByIndex(index: number): void };
  overview: Observable<string>;
  api: Observable<string>;
  example: Observable<Array<{ name: string; portal: ComponentPortal<any> }>>;
  private _destroyed = new Subject<void>();

  constructor(
    private _htmlLoader: HtmlLoader,
    private _exampleProvider: ExampleProvider,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.example = this._route.params.pipe(
      takeUntil(this._destroyed),
      map(({ id }) => this._exampleProvider.resolveExample(id)),
      map(examples =>
        examples ? Object.keys(examples).map(name => ({ name, portal: examples[name] })) : null
      )
    );
    this.overview = this._htmlLoader
      .with(this._route)
      .fromDocumentation()
      .observe();
    this.api = this._htmlLoader
      .with(this._route)
      .fromApiDocumentation()
      .observe();
  }

  ngAfterViewInit(): void {
    this._route.params
      .pipe(
        first(),
        filter(p => p.section),
        map(p => (p.section === 'api' ? 1 : 2))
      )
      .subscribe(s => this.tabs.openTabByIndex(s));
    this._route.params
      .pipe(
        takeUntil(this._destroyed),
        map(({ id }) => id),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(() => this.tabs.openTabByIndex(0));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}
