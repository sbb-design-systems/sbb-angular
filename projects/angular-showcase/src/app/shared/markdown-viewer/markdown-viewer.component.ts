import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { HtmlLoader } from '../html-loader.service';

@Component({
  selector: 'sbb-markdown-viewer',
  template: '',
  styleUrls: ['./markdown-viewer.component.scss']
})
export class MarkdownViewerComponent implements AfterViewInit, OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
    private _renderer: Renderer2,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit(): void {
    this._htmlLoader
      .with(this._route, this._renderer)
      .until(this._destroyed)
      .fromDocumentation()
      .applyTo(this._elementRef);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
