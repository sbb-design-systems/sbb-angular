import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { ExampleProvider } from '../../shared/example-provider';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.scss']
})
export class ComponentViewerComponent implements OnInit, OnDestroy {
  @ViewChild('overview', { static: true }) overview: ElementRef;
  example: Observable<ComponentPortal<any>>;
  private _destroyed = new Subject<void>();

  constructor(
    private _http: HttpClient,
    private _exampleProvider: ExampleProvider,
    private _route: ActivatedRoute,
    private _renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this._destroyed.next();
  }

  ngOnInit() {
    combineLatest(this._route.params, this._route.data, (p, d) => ({ ...p, ...d }))
      .pipe(
        takeUntil(this._destroyed),
        switchMap(({ id, library }) =>
          this._http.get(`assets/docs/${library}/${id}.html`, { responseType: 'text' })
        )
      )
      .subscribe(c => this._renderer.setProperty(this.overview.nativeElement, 'innerHTML', c));
    this.example = this._route.params.pipe(
      takeUntil(this._destroyed),
      map(({ id }) => this._exampleProvider.resolveExample(id)),
      map(e => (e ? new ComponentPortal(e) : null))
    );
  }
}
