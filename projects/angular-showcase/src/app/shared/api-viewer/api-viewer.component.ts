import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { HtmlLoader } from '../html-loader.service';

@Component({
  selector: 'sbb-api-viewer',
  templateUrl: './api-viewer.component.html',
  styleUrls: ['./api-viewer.component.scss']
})
export class ApiViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('content', { static: true, read: ElementRef }) content: ElementRef<any>;
  private _destroyed = new Subject<void>();

  constructor(private _htmlLoader: HtmlLoader, private _route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this._htmlLoader.loadApiDocumentation(this._route, this._destroyed, this.content);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}
