import { Component, inject, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { HtmlLoader } from '../html-loader.service';
import { moduleParams } from '../module-params';

@Component({
  selector: 'sbb-markdown-viewer',
  template: '',
  styleUrls: ['./markdown-viewer.component.scss'],
  host: {
    '[innerHTML]': 'content()',
  },
  standalone: false,
})
export class MarkdownViewerComponent {
  private _htmlLoader = inject(HtmlLoader);
  private _route = inject(ActivatedRoute);
  private _domSanitizer = inject(DomSanitizer);

  content: Signal<SafeHtml | undefined> = toSignal(
    moduleParams(this._route).pipe(
      switchMap((params) => this._htmlLoader.withParams(params).fromDocumentation().load()),
      map((content) => this._domSanitizer.bypassSecurityTrustHtml(content)),
      takeUntilDestroyed(),
    ),
  );
}
