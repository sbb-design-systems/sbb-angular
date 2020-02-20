import { Component, ViewChild } from '@angular/core';
import { TabsComponent } from '@sbb-esta/angular-business/tabs';

import { ComponentViewerBase } from '../../../shared/component-viewer-base';

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
