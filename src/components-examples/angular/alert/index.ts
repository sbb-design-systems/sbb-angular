import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbAlertModule } from '@sbb-esta/angular/alert';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { AlertExternalLinkExample } from './alert-external-link/alert-external-link-example';
import { AlertOutletExample } from './alert-outlet/alert-outlet-example';
import { AlertRouterLinkExample } from './alert-router-link/alert-router-link-example';
import { AlertSimpleExample } from './alert-simple/alert-simple-example';

export { AlertSimpleExample, AlertExternalLinkExample, AlertRouterLinkExample, AlertOutletExample };

const EXAMPLES = [
  AlertSimpleExample,
  AlertExternalLinkExample,
  AlertRouterLinkExample,
  AlertOutletExample,
];

@NgModule({
  imports: [CommonModule, RouterModule, SbbIconModule, SbbButtonModule, SbbAlertModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class AlertExamplesModule {}
