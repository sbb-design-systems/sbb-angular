import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, Directive, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, skip, take, takeUntil } from 'rxjs/operators';

import { ExampleProvider, EXAMPLES } from './example-provider';
import { HtmlLoader } from './html-loader.service';

@Directive()
export class ComponentViewerBase implements OnInit, AfterViewInit, OnDestroy {
  tabs: { openTabByIndex(index: number): void };
  overview: Observable<string>;
  api: Observable<string>;
  example: Observable<Array<{ name: string; portal: ComponentPortal<any> }> | null>;
  private _destroyed = new Subject<void>();

  constructor(
    @Inject(EXAMPLES) private _examples: ExampleProvider[],
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.example = combineLatest(this._route.params, this._route.data).pipe(
      takeUntil(this._destroyed),
      map(
        ([{ id }, { library }]) =>
          this._examples.find((e) => e.library === library && e.moduleName === id)?.examples
      ),
      map((examples) =>
        examples
          ? Object.keys(examples).map((name) => ({
              name,
              portal: new ComponentPortal(examples[name]),
            }))
          : null
      )
    );
    this.overview = this._htmlLoader.with(this._route).fromModuleDocumentation().observe();
    this.api = this._htmlLoader.with(this._route).fromApiDocumentation().observe();
  }

  ngAfterViewInit(): void {
    this._route.params
      .pipe(
        take(1),
        filter((p) => p.section),
        map((p) => (p.section === 'api' ? 1 : 2))
      )
      .subscribe((s) => this.tabs.openTabByIndex(s));
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
