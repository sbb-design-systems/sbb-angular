import { Component, HostBinding, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsComponent } from '@sbb-esta/angular-business/tabs';

import { ComponentViewerBase } from '../../../shared/component-viewer-base';
import { ExampleProvider } from '../../../shared/example-provider';
import { HtmlLoader } from '../../../shared/html-loader.service';

@Component({
  selector: 'sbb-business-component-viewer',
  templateUrl:
    '../../core-component-viewer/core-component-viewer/core-component-viewer.component.html',
  styleUrls: [
    '../../core-component-viewer/core-component-viewer/core-component-viewer.component.scss'
  ]
})
export class BusinessComponentViewerComponent extends ComponentViewerBase {
  @ViewChild(TabsComponent, { static: true }) tabs: TabsComponent;
}
