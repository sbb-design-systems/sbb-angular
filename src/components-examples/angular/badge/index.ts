import { NgModule } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';
import { SbbButtonModule } from '@sbb-esta/angular/button';

import { BadgeOverviewExample } from './badge-overview/badge-overview-example';

export { BadgeOverviewExample };

const EXAMPLES = [BadgeOverviewExample];

@NgModule({
  imports: [SbbBadgeModule, SbbButtonModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  entryComponents: EXAMPLES,
})
export class BadgeExamplesModule {}
