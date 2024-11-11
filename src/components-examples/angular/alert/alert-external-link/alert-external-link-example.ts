import { Component } from '@angular/core';
import { SbbAlertModule } from '@sbb-esta/angular/alert';

/**
 * @title Alert with external link
 * @order 30
 */
@Component({
  selector: 'sbb-alert-external-link-example',
  templateUrl: 'alert-external-link-example.html',
  imports: [SbbAlertModule],
})
export class AlertExternalLinkExample {}
