import { Component, HostBinding, OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import { moduleParams } from '../../module-params';

@Component({
  selector: 'sbb-html-viewer',
  template: '',
  styleUrls: ['./html-viewer.component.css'],
  standalone: false,
})
export class HtmlViewerComponent implements OnDestroy {
  @HostBinding('innerHTML')
  content: SafeHtml;

  private readonly _destroyed = new Subject<void>();

  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
    private _domSanitizer: DomSanitizer,
  ) {
    moduleParams(this._route)
      .pipe(
        switchMap((params) =>
          params.loaderBuilderInterceptor(this._htmlLoader.withParams(params)).load(),
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
        takeUntil(this._destroyed),
      )
      .subscribe((content) => (this.content = this._domSanitizer.bypassSecurityTrustHtml(content)));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
