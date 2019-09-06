import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentViewerBase } from '../../shared/component-viewer-base';
import { ExampleProvider } from '../../shared/example-provider';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.scss']
})
export class ComponentViewerComponent extends ComponentViewerBase {
  constructor(
    http: HttpClient,
    exampleProvider: ExampleProvider,
    route: ActivatedRoute,
    renderer: Renderer2
  ) {
    super(http, exampleProvider, route, renderer);
  }
}
