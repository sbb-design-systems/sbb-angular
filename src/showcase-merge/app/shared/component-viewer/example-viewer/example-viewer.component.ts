import { Component, Injector, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExampleData, loadExample } from '@sbb-esta/components-examples';
import { Observable, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import { moduleParams } from '../../module-params';
import {
  ExampleData as StackblitzExampleData,
  StackblitzWriterService,
} from '../stackblitz-writer/stackblitz-writer.service';

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

  isStackblitzDisabled = true;
  stackBlitzForm: HTMLFormElement;

  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
    private _stackBlitzWriter: StackblitzWriterService
  ) {}

  ngOnInit(): void {
    const exampleName = this.exampleData.selectorName.replace('sbb-', '').replace('-example', '');

    this.html = this._createLoader(exampleName, 'html');
    this.ts = this._createLoader(exampleName, 'ts');
    this.css = this._createLoader(exampleName, 'css');

    const exampleContents = ['ts', 'html', 'css'].map((type: 'ts' | 'html' | 'css') =>
      moduleParams(this._route).pipe(
        switchMap((params) =>
          this._htmlLoader
            .withParams(params)
            .fromSourceExamples(exampleName, type)
            .load()
            .pipe(map((content) => ({ name: `${this.exampleData.selectorName}.${type}`, content })))
        )
      )
    );
    zip(...exampleContents).subscribe((results) =>
      this._createStackblitzForm(results.filter((result) => !!result.content))
    );
  }

  private _createLoader(exampleName: string, type: 'html' | 'ts' | 'css') {
    return moduleParams(this._route).pipe(
      switchMap((params) =>
        this._htmlLoader.withParams(params).fromExamples(exampleName, type).load()
      )
    );
  }

  private _createStackblitzForm(files: { name: string; content: string }[]) {
    if (!files.length) {
      console.error('Stackblitz example contents could not be loaded');
      return;
    }
    const example = new StackblitzExampleData({
      componentName: this.exampleData.componentNames[0].concat('Component'),
      selectorName: this.exampleData.selectorName,
      description: this.exampleData.description,
      indexFilename: files[0].name,
      exampleFiles: files,
      business: this._route.snapshot.data.library === 'business',
    });
    this._stackBlitzWriter
      .constructStackBlitzForm(example)
      .then((stackBlitzForm: HTMLFormElement) => {
        this.stackBlitzForm = stackBlitzForm;
        this.isStackblitzDisabled = false;
      });
  }

  openStackblitz() {
    // When the form is submitted, it must be in the document body. The standard of forms is not
    // to submit if it is detached from the document. See the following chromium commit for
    // more details:
    // https://chromium.googlesource.com/chromium/src/+/962c2a22ddc474255c776aefc7abeba00edc7470%5E!
    document.body.appendChild(this.stackBlitzForm);
    this.stackBlitzForm.submit();
    document.body.removeChild(this.stackBlitzForm);
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
