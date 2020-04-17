import { Component, ViewChild } from '@angular/core';
import { TabsComponent } from '@sbb-esta/angular-public/tabs';

import { ComponentViewerBase } from '../../component-viewer-base';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.css']
})
export class ComponentViewerComponent extends ComponentViewerBase {
  @ViewChild(TabsComponent, { static: true }) tabs: TabsComponent;
}
