import { Component } from '@angular/core';

import { CoreExampleViewerComponent } from '../../core-component-viewer/core-example-viewer/core-example-viewer.component';

@Component({
  selector: 'sbb-example-viewer',
  templateUrl: '../../core-component-viewer/core-example-viewer/core-example-viewer.component.html',
  styleUrls: [
    '../../core-component-viewer/core-example-viewer/core-example-viewer.component.css',
    './public-example-viewer.component.css'
  ]
})
export class PublicExampleViewerComponent extends CoreExampleViewerComponent {}
