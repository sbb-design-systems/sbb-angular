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
  styleUrls: ['./example-viewer.component.css'],
})
export class ExampleViewerComponent implements OnInit {
  @Input() exampleData: ExampleData;
  exampleCodes: Observable<ExampleCode[]>;
  showSource = false;
  private _exampleFileOrder = ['html', 'ts', 'css'];
  constructor(private _htmlLoader: HtmlLoader, private _route: ActivatedRoute) {}

  // Returns the path to the html file for a given example file.
  private static _convertToHtmlFilePath(filePath: string): string {
    return filePath.replace(/(.*)[.](html|ts|css)/, '$1-$2.html');
  }

  // Get the example name from the selector name
  private static _convertToExampleName(selectorName: string): string {
    return selectorName.replace('sbb-', '').replace('-example', '');
  }

  // Get the extension for a given file path
  private static _getFileExtension(filePath: string): string {
    return filePath.split('.').pop();
  }

  ngOnInit(): void {
    this.exampleCodes = combineLatest(
      this.exampleData.exampleFiles.map((exampleFile) =>
        this._createLoader(
          ExampleViewerComponent._convertToExampleName(this.exampleData.selectorName),
          exampleFile
        ).pipe(
          map((code) => ({
            label: ExampleViewerComponent._getFileExtension(exampleFile),
            code,
          }))
        )
      )
    ).pipe(
      map((exampleCodes: ExampleCode[]) =>
        exampleCodes.sort(
          (a, b) =>
            this._exampleFileOrder.indexOf(a.label) - this._exampleFileOrder.indexOf(b.label)
        )
      )
    );
  }

  private _createLoader(exampleName: string, exampleFile: string) {
    const exampleHtmlFile = ExampleViewerComponent._convertToHtmlFilePath(exampleFile);
    return moduleParams(this._route).pipe(
      switchMap((params) =>
        this._htmlLoader.withParams(params).fromExamples(exampleName, exampleHtmlFile).load()
      )
    );
  }

  stackBlitzEnabled() {
    return moduleParams(this._route).pipe(map((params) => params.packageName === 'angular'));
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
