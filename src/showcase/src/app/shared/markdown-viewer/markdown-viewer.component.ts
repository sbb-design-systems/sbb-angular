import { AfterViewInit, Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HtmlLoader } from '../html-loader.service';

@Component({
  selector: 'sbb-markdown-viewer',
  template: '',
  styleUrls: ['./markdown-viewer.component.scss']
})
export class MarkdownViewerComponent implements AfterViewInit, OnDestroy {
  private _destroyed = new Subject<void>();

  @HostBinding('innerHTML')
  content: string;

  constructor(private _htmlLoader: HtmlLoader, private _route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this._htmlLoader
      .with(this._route)
      .fromDocumentation()
      .observe()
      .pipe(takeUntil(this._destroyed))
      .subscribe(content => (this.content = content));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
