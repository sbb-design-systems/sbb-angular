import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import {
  ExampleData,
  StackblitzWriterService,
} from '../stackblitz-writer/stackblitz-writer.service';

@Component({
  selector: 'sbb-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.css'],
})
export class ExampleViewerComponent implements OnInit {
  @Input() example: ComponentPortal<any>;
  @Input() name: string;
  html: Observable<string>;
  ts: Observable<string>;
  scss: Observable<string>;
  showSource = false;
  title: Observable<string>;

  isStackblitzDisabled = true;
  stackBlitzForm: HTMLFormElement;

  get label() {
    return this.name
      .replace(/-/g, ' ')
      .replace(/(^[a-z]| [a-z])/g, (m) => m.toUpperCase())
      .replace(' Showcase', '');
  }

  get componentName() {
    return this.name
      .replace(/(^[a-z]|-[a-z])/g, (m) => m.toUpperCase())
      .replace(/-/g, '')
      .concat('Component');
  }

  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
    private _stackBlitzWriter: StackblitzWriterService
  ) {}

  ngOnInit(): void {
    this.title = combineLatest([this._route.params, this._route.data]).pipe(
      map(([p, d]) => ({ ...p, ...d })),
      map(({ id }) =>
        (id as string)
          .replace(/^([a-z])/, (m) => m.toUpperCase())
          .replace(/-([a-z])/g, (m) => ` ${m.toUpperCase()}`)
      )
    );

    this.html = this._htmlLoader.with(this._route).fromExamples(this.name, 'html').observe();

    this.ts = this._htmlLoader.with(this._route).fromExamples(this.name, 'ts').observe();

    this.scss = this._htmlLoader.with(this._route).fromExamples(this.name, 'scss').observe();

    const exampleContents = ['ts', 'html', 'scss'].map((type: 'ts' | 'html' | 'scss') =>
      this._htmlLoader
        .with(this._route)
        .fromSourceExamples(this.name, type)
        .observe()
        .pipe(map((content) => ({ name: `${this.name}.${type}`, content })))
    );
    zip(...exampleContents).subscribe((results) =>
      this._createStackblitzForm(results.filter((result) => !!result.content))
    );
  }

  private _createStackblitzForm(files: { name: string; content: string }[]) {
    const example = new ExampleData({
      componentName: this.componentName,
      selectorName: `${this.name}`,
      description: this.label,
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
