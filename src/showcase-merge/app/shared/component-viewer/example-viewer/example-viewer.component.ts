import {
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExampleData } from '@sbb-esta/components-examples';
import { Observable, Subject, zip } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import {
  ExampleData as StackblitzExampleData,
  StackblitzWriterService,
} from '../stackblitz-writer/stackblitz-writer.service';

@Component({
  selector: 'sbb-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.css'],
})
export class ExampleViewerComponent implements OnInit, OnDestroy {
  @Input() exampleData: ExampleData;
  html: Observable<string>;
  ts: Observable<string>;
  scss: Observable<string>;
  showSource = false;

  isStackblitzDisabled = true;
  stackBlitzForm: HTMLFormElement;

  private _destroyed = new Subject<void>();
  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
    private _stackBlitzWriter: StackblitzWriterService
  ) {}

  ngOnInit(): void {
    this.html = this._htmlLoader
      .with(this._route)
      .fromExamples(this.exampleData.selectorName, 'html')
      .observe();

    this.ts = this._htmlLoader
      .with(this._route)
      .fromExamples(this.exampleData.selectorName, 'ts')
      .observe();

    this.scss = this._htmlLoader
      .with(this._route)
      .fromExamples(this.exampleData.selectorName, 'scss')
      .observe();

    const exampleContents = ['ts', 'html', 'scss'].map((type: 'ts' | 'html' | 'scss') =>
      this._htmlLoader
        .with(this._route)
        .fromSourceExamples(this.exampleData.selectorName, type)
        .observe()
        .pipe(map((content) => ({ name: `${this.exampleData.selectorName}.${type}`, content })))
    );
    zip(...exampleContents)
      .pipe(takeUntil(this._destroyed))
      .subscribe((results) =>
        this._createStackblitzForm(results.filter((result) => !!result.content))
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

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}

@Component({
  selector: 'sbb-example-outlet',
  template: '',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ExampleOutletComponent implements OnInit {
  @Input() exampleData: ExampleData;

  constructor(private _viewContainerRef: ViewContainerRef, private _injector: Injector) {}

  async ngOnInit() {
    this._viewContainerRef.createComponent(await this.exampleData.componentFactory(this._injector));
  }
}
