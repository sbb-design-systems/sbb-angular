import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SbbTabs } from '@sbb-esta/angular-public/tabs';
import { ExampleData } from '@sbb-esta/components-examples';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, skip, take, takeUntil } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import { ShowcaseMeta, ShowcaseMetaEntry } from '../../meta';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.css'],
})
export class ComponentViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(SbbTabs, { static: true }) tabs: SbbTabs;
  overview: Observable<string>;
  api: Observable<string>;
  examples: Observable<ExampleData[] | null>;
  showcaseMetaEntry: Observable<ShowcaseMetaEntry>;

  private _destroyed = new Subject<void>();

  constructor(private _htmlLoader: HtmlLoader, private _route: ActivatedRoute) {}

  ngOnInit() {
    this.examples = combineLatest([this._route.params, this._route.data]).pipe(
      map(([{ id }, { library }]) => {
        const examples = ExampleData.find(library, id);
        return examples.length === 0 ? null : examples;
      })
    );
    this.overview = this._htmlLoader.with(this._route).fromModuleDocumentation().observe();
    this.api = this._htmlLoader.with(this._route).fromApiDocumentation().observe();

    this.showcaseMetaEntry = combineLatest([this._route.params, this._route.data]).pipe(
      map(([{ id }, { library }]) => ShowcaseMeta.findEntryByPackageNameAndComponentId(library, id))
    );
  }

  ngAfterViewInit(): void {
    this._route.params
      .pipe(
        take(1),
        map((p) => {
          switch (p.section) {
            case 'api':
              return 1;
            case 'examples':
              return 2;
            default:
              return 0;
          }
        })
      )
      .subscribe((s) => this.tabs.openTabByIndex(s));
    this._route.params
      .pipe(
        map(({ id }) => id),
        distinctUntilChanged(),
        skip(1),
        takeUntil(this._destroyed)
      )
      .subscribe(() => this.tabs.openTabByIndex(0));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}
