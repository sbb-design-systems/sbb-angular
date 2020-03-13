import { Component, ViewChild } from '@angular/core';
import { TabsComponent } from '@sbb-esta/angular-public/tabs';

import { ComponentViewerBase } from '../../../shared/component-viewer-base';

@Component({
  selector: 'sbb-public-component-viewer',
  templateUrl:
    '../../core-component-viewer/core-component-viewer/core-component-viewer.component.html',
  styleUrls: [
    '../../core-component-viewer/core-component-viewer/core-component-viewer.component.css'
  ]
})
export class PublicComponentViewerComponent extends ComponentViewerBase {
  @ViewChild(TabsComponent, { static: true }) tabs: TabsComponent;
}
