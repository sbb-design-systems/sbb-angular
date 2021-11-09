import { Component, Injector, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExampleData, loadExample } from '@sbb-esta/components-examples';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import { moduleParams } from '../../module-params';

@Component({
  selector: 'sbb-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.css'],
})
export class ExampleViewerComponent implements OnInit {
  @Input() exampleData: ExampleData;
  html: Observable<string>;
  ts: Observable<string>;
  css: Observable<string>;
  showSource = false;

  constructor(private _htmlLoader: HtmlLoader, private _route: ActivatedRoute) {}

  ngOnInit(): void {
    const exampleName = this.exampleData.selectorName.replace('sbb-', '').replace('-example', '');

    this.html = this._createLoader(exampleName, 'html');
    this.ts = this._createLoader(exampleName, 'ts');
    this.css = this._createLoader(exampleName, 'css');
  }

  private _createLoader(exampleName: string, type: 'html' | 'ts' | 'css') {
    return moduleParams(this._route).pipe(
      switchMap((params) =>
        this._htmlLoader.withParams(params).fromExamples(exampleName, type).load()
      )
    );
  }
}

@Component({
  selector: 'sbb-example-outlet',
  template: '',
})
export class ExampleOutletComponent implements OnInit {
  @Input() exampleData: ExampleData;

  constructor(private _viewContainerRef: ViewContainerRef, private _injector: Injector) {}

  async ngOnInit() {
    const example = await loadExample(this.exampleData.id, this._injector);
    this._viewContainerRef.createComponent(example.component, { injector: example.injector });
  }
}
