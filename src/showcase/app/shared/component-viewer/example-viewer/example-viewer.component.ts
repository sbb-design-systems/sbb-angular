import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HtmlLoader } from '../../../shared/html-loader.service';

@Component({
  selector: 'sbb-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.css']
})
export class ExampleViewerComponent implements OnInit {
  @Input() example: ComponentPortal<any>;
  @Input() name: string;
  html: Observable<string>;
  ts: Observable<string>;
  scss: Observable<string>;
  showSource = false;
  title: Observable<string>;
  get label() {
    return this.name
      .replace(/-/g, ' ')
      .replace(/(^[a-z]| [a-z])/g, m => m.toUpperCase())
      .replace(' Showcase', '');
  }

  constructor(private _htmlLoader: HtmlLoader, private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.title = combineLatest([this._route.params, this._route.data]).pipe(
      map(([p, d]) => ({ ...p, ...d })),
      map(({ id }) =>
        (id as string)
          .replace(/^([a-z])/, m => m.toUpperCase())
          .replace(/-([a-z])/g, m => ` ${m.toUpperCase()}`)
      )
    );

    this.html = this._htmlLoader
      .with(this._route)
      .fromExamples(this.name, 'html')
      .observe();

    this.ts = this._htmlLoader
      .with(this._route)
      .fromExamples(this.name, 'ts')
      .observe();

    this.scss = this._htmlLoader
      .with(this._route)
      .fromExamples(this.name, 'scss')
      .observe();
  }
}
