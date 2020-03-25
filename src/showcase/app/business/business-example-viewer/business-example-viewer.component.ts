import { Component } from '@angular/core';

import { ExampleViewerComponent } from '../../shared/component-viewer/example-viewer/example-viewer.component';

@Component({
  selector: 'sbb-business-example-viewer',
  templateUrl: './business-example-viewer.component.html',
  styleUrls: ['./business-example-viewer.component.css']
})
export class BusinessExampleViewerComponent extends ExampleViewerComponent {}
