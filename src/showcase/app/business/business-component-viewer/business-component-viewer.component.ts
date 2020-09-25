import { Component, ViewChild } from '@angular/core';
import { SbbTabs } from '@sbb-esta/angular-business/tabs';

import { ComponentViewerBase } from '../../shared/component-viewer-base';

@Component({
  selector: 'sbb-business-component-viewer',
  templateUrl: './business-component-viewer.component.html',
  styleUrls: ['./business-component-viewer.component.css'],
})
export class BusinessComponentViewerComponent extends ComponentViewerBase {
  @ViewChild(SbbTabs, { static: true }) tabs: SbbTabs;
}
