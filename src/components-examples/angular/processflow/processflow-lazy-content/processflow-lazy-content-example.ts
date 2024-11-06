import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbProcessflowModule } from '@sbb-esta/angular/processflow';

/**
 * @title Processflow lazy content rendering
 * @order 20
 */
@Component({
  selector: 'sbb-processflow-lazy-content-example',
  templateUrl: 'processflow-lazy-content-example.html',
  imports: [SbbProcessflowModule, SbbButtonModule],
})
export class ProcessflowLazyContentExample {}
