import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { MenuIconsExample } from './menu-icons/menu-icons-example';
import { MenuNestedExample } from './menu-nested/menu-nested-example';
import { MenuOverviewExample } from './menu-overview/menu-overview-example';
import { MenuPositionExample } from './menu-position/menu-position-example';

export { MenuIconsExample, MenuOverviewExample, MenuPositionExample, MenuNestedExample };

const EXAMPLES = [MenuIconsExample, MenuOverviewExample, MenuPositionExample, MenuNestedExample];

@NgModule({
  imports: [SbbButtonModule, SbbIconModule, SbbMenuModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  entryComponents: EXAMPLES,
})
export class MenuExamplesModule {}
