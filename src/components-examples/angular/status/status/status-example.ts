import { Component } from '@angular/core';
import { SbbStatusModule } from '@sbb-esta/angular/status';

/**
 * @title Status
 * @order 10
 */
@Component({
  selector: 'sbb-status-example',
  templateUrl: 'status-example.html',
  imports: [SbbStatusModule],
})
export class StatusExample {}
