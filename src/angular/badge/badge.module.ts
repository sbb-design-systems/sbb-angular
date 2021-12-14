import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbBadge } from './badge';

@NgModule({
  imports: [A11yModule, SbbCommonModule],
  exports: [SbbBadge],
  declarations: [SbbBadge],
})
export class SbbBadgeModule {}
