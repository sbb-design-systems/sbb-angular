import { Component, HostBinding, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsComponent } from '@sbb-esta/angular-public/tabs';

import { ComponentViewerBase } from '../../../shared/component-viewer-base';
import { ExampleProvider } from '../../../shared/example-provider';
import { HtmlLoader } from '../../../shared/html-loader.service';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl:
    '../../core-component-viewer/core-component-viewer/core-component-viewer.component.html',
  styleUrls: [
    '../../core-component-viewer/core-component-viewer/core-component-viewer.component.scss'
  ]
})
export class PublicComponentViewerComponent extends ComponentViewerBase {
  @ViewChild(TabsComponent, { static: true }) tabs: TabsComponent;

  @HostBinding('class.sbb-component-viewer-public') publicClass = true;

  constructor(
    htmlLoader: HtmlLoader,
    exampleProvider: ExampleProvider,
    route: ActivatedRoute,
    renderer: Renderer2
  ) {
    super(htmlLoader, exampleProvider, route, renderer);
  }
}
