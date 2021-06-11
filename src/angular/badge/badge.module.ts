import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';

import { SbbBadge } from './badge';

@NgModule({
  imports: [A11yModule],
  exports: [SbbBadge],
  declarations: [SbbBadge],
})
export class SbbBadgeModule {}
