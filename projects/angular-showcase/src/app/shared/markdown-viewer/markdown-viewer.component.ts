import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { MarkdownProvider } from '../markdown-provider';

@Component({
  selector: 'sbb-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.scss']
})
export class MarkdownViewerComponent implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    route: ActivatedRoute,
    markdownProvider: MarkdownProvider,
    elementRef: ElementRef,
    renderer: Renderer2
  ) {
    route.params
      .pipe(
        takeUntil(this._destroyed),
        switchMap(({ id }) => markdownProvider.downloadMarkdown(id))
      )
      .subscribe(c => renderer.setProperty(elementRef.nativeElement, 'innerHTML', c));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}
