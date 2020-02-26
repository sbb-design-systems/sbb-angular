import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HtmlLoader } from '../html-loader.service';

@Component({
  selector: 'sbb-api-viewer',
  templateUrl: './api-viewer.component.html',
  styleUrls: ['./api-viewer.component.scss']
})
export class ApiViewerComponent {
  constructor(private _htmlLoader: HtmlLoader, private _route: ActivatedRoute) {}

  content = this._htmlLoader
    .with(this._route)
    .fromApiDocumentation()
    .observe();
}
