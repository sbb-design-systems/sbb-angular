import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { MenuGroupingExample } from './menu-grouping/menu-grouping-example';
import { MenuIconsExample } from './menu-icons/menu-icons-example';
import { MenuLazyRenderingExample } from './menu-lazy-rendering/menu-lazy-rendering-example';
import { MenuNestedExample } from './menu-nested/menu-nested-example';
import { MenuOverviewExample } from './menu-overview/menu-overview-example';

export {
  MenuGroupingExample,
  MenuIconsExample,
  MenuLazyRenderingExample,
  MenuNestedExample,
  MenuOverviewExample,
};

const EXAMPLES = [
  MenuIconsExample,
  MenuLazyRenderingExample,
  MenuNestedExample,
  MenuOverviewExample,
  MenuGroupingExample,
];

@NgModule({
  imports: [SbbButtonModule, SbbIconModule, SbbMenuModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class MenuExamplesModule {}
