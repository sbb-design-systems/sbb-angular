import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  Renderer2
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { HtmlLoader } from '../html-loader.service';

@Component({
  selector: 'sbb-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.scss']
})
export class MarkdownViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('content', { static: true, read: ElementRef }) content: ElementRef<any>;
  private _destroyed = new Subject<void>();

  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
    private _renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this._htmlLoader
      .with(this._route, this._renderer)
      .until(this._destroyed)
      .fromDocumentation()
      .applyTo(this.content);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}
