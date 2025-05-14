import { Component, Injector, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExampleData, loadExample } from '@sbb-esta/components-examples';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HtmlLoader } from '../../html-loader.service';
import { moduleParams } from '../../module-params';

interface ExampleCode {
  label: string;
  code: string;
}

@Component({
  selector: 'sbb-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss'],
  standalone: false,
})
export class ExampleViewerComponent implements OnInit {
  @Input() exampleData: ExampleData;
  exampleCodes: Observable<ExampleCode[]>;
  showSource: boolean = false;
  private _defaultExtensionsOrder = ['html', 'ts', 'css'];

  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.exampleCodes = combineLatest(
      this.exampleData.exampleFiles.map((exampleFile) =>
        this._createLoader(
          this._convertToExampleName(this.exampleData.selectorName),
          exampleFile,
        ).pipe(
          map((code) => ({
            label: this._convertToFileLabel(exampleFile),
            code,
          })),
        ),
      ),
    ).pipe(
      map((exampleCodes: ExampleCode[]) =>
        exampleCodes.sort(
          (a, b) =>
            this._defaultExtensionsOrder.indexOf(a.label) -
            this._defaultExtensionsOrder.indexOf(b.label),
        ),
      ),
    );
  }

  stackBlitzEnabled() {
    return moduleParams(this._route).pipe(
      map((params) => ['angular', 'journey-maps'].includes(params.packageName)),
    );
  }

  private _createLoader(exampleName: string, exampleFile: string) {
    const exampleHtmlFile = this._convertToHtmlFilePath(exampleFile);
    return moduleParams(this._route).pipe(
      switchMap((params) =>
        this._htmlLoader.withParams(params).fromExamples(exampleName, exampleHtmlFile).load(),
      ),
    );
  }

  // Returns the path to the html file for a given example file.
  private _convertToHtmlFilePath(filePath: string): string {
    return filePath.replace(/(.*)[.](html|ts|css)/, '$1-$2.html');
  }

  // Get the example name from the selector name
  private _convertToExampleName(selectorName: string): string {
    return selectorName.replace('sbb-', '').replace('-example', '');
  }

  // Get the label for a given html example file
  private _convertToFileLabel(filePath: string): string {
    const showExtensionOnly =
      this._removeFileExtension(this.exampleData.indexFilename) ===
      this._removeFileExtension(filePath);
    return showExtensionOnly ? filePath.split('.').pop().toUpperCase() : filePath;
  }

  // Remove the extension from a given file
  private _removeFileExtension(filePath: string): string {
    return filePath.replace(/\.[^/.]+$/, '');
  }
}

@Component({
  selector: 'sbb-example-outlet',
  template: '',
  standalone: false,
})
export class ExampleOutletComponent implements OnInit {
  @Input() exampleData: ExampleData;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _injector: Injector,
  ) {}

  async ngOnInit() {
    const example = await loadExample(this.exampleData.id, this._injector);
    this._viewContainerRef.createComponent(example.component, { injector: example.injector });
  }
}
