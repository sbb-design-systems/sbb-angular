import { Component } from '@angular/core';
import { SbbAlertModule } from '@sbb-esta/angular/alert';

/**
 * @title Simple Alert
 * @order 10
 */
@Component({
  selector: 'sbb-alert-simple-example',
  templateUrl: 'alert-simple-example.html',
  imports: [SbbAlertModule],
})
export class AlertSimpleExample {}
