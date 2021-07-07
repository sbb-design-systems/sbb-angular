import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { HtmlLoader } from '../html-loader.service';
import { moduleParams } from '../module-params';

@Component({
  selector: 'sbb-markdown-viewer',
  template: '',
  styleUrls: ['./markdown-viewer.component.css'],
})
export class MarkdownViewerComponent implements AfterViewInit {
  @HostBinding('innerHTML')
  content: SafeHtml;

  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
    private _domSanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    moduleParams(this._route)
      .pipe(switchMap((params) => this._htmlLoader.withParams(params).fromDocumentation().load()))
      .subscribe((content) => (this.content = this._domSanitizer.bypassSecurityTrustHtml(content)));
  }
}
