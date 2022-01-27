import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import { moduleParams } from '../../module-params';

@Component({
  selector: 'sbb-html-viewer',
  templateUrl: './html-viewer.component.html',
  styleUrls: ['./html-viewer.component.css'],
})
export class HtmlViewerComponent implements OnInit {
  html: Observable<string | null>;

  constructor(private _htmlLoader: HtmlLoader, private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.html = moduleParams(this._route).pipe(
      switchMap((params) =>
        params.loaderBuilderInterceptor(this._htmlLoader.withParams(params)).load()
      )
    );
  }
}
