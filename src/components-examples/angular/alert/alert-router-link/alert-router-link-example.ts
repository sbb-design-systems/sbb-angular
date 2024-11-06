import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SbbAlertModule } from '@sbb-esta/angular/alert';

/**
 * @title Alert with Router link
 * @order 20
 */
@Component({
  selector: 'sbb-alert-router-link-example',
  templateUrl: 'alert-router-link-example.html',
  imports: [SbbAlertModule, RouterLink],
})
export class AlertRouterLinkExample {}
