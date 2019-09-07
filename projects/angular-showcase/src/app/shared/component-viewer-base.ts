import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsComponent } from '@sbb-esta/angular-public/tabs';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, skip, takeUntil } from 'rxjs/operators';

import { ExampleProvider } from './example-provider';
import { HtmlLoader } from './html-loader.service';

export class ComponentViewerBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(TabsComponent, { static: true }) tabs: TabsComponent;
  @ViewChild('overview', { static: true }) overview: ElementRef;
  @ViewChild('api', { static: true }) api: ElementRef;
  example: Observable<ComponentPortal<any>>;
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
      map(e => (e ? new ComponentPortal(e) : null))
    );
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
    this._htmlLoader.loadDocumentation(this._route, this._destroyed, this.overview);
    this._htmlLoader.loadApiDocumentation(this._route, this._destroyed, this.api);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}
