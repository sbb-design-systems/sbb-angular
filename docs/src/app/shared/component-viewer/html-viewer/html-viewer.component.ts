import { Component, inject, SecurityContext, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import { moduleParams } from '../../module-params';

@Component({
  selector: 'sbb-html-viewer',
  template: '',
  styleUrls: ['./html-viewer.component.scss'],
  host: {
    '[innerHTML]': 'content()',
  },
})
export class HtmlViewerComponent {
  private _route = inject(ActivatedRoute);
  private _htmlLoader = inject(HtmlLoader);
  private _domSanitizer = inject(DomSanitizer);

  content: Signal<SafeHtml | undefined> = toSignal(
    moduleParams(this._route).pipe(
      switchMap((params) =>
        params.loaderBuilderInterceptor!(this._htmlLoader.withParams(params)).load(),
      ),
      map((content) => {
        // Replace all relative fragment URLs with absolute fragment URLs. e.g. "#my-section" becomes
        // "/angular/components/button/overview#my-section". This is necessary because otherwise these fragment
        // links would redirect to "/#my-section".
        return content.replace(/href="#([^"]*)"/g, (_m: string, fragmentUrl: string) => {
          const absoluteUrl = `${location.pathname}#${fragmentUrl}`;
          return `href="${this._domSanitizer.sanitize(SecurityContext.URL, absoluteUrl)}"`;
        });
      }),
      map((content) => this._domSanitizer.bypassSecurityTrustHtml(content)),
      takeUntilDestroyed(),
    ),
  )!;
}
