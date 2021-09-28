import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbGhettoboxModule } from '@sbb-esta/angular/ghettobox';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { GhettoboxExternalLinkExample } from './ghettobox-external-link/ghettobox-external-link-example';
import { GhettoboxOutletExample } from './ghettobox-outlet/ghettobox-outlet-example';
import { GhettoboxRouterLinkExample } from './ghettobox-router-link/ghettobox-router-link-example';
import { GhettoboxSimpleExample } from './ghettobox-simple/ghettobox-simple-example';

export {
  GhettoboxSimpleExample,
  GhettoboxExternalLinkExample,
  GhettoboxRouterLinkExample,
  GhettoboxOutletExample,
};

const EXAMPLES = [
  GhettoboxSimpleExample,
  GhettoboxExternalLinkExample,
  GhettoboxRouterLinkExample,
  GhettoboxOutletExample,
];

@NgModule({
  imports: [CommonModule, RouterModule, SbbIconModule, SbbButtonModule, SbbGhettoboxModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class GhettoboxExamplesModule {}
