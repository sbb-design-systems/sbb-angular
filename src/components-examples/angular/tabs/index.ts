import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

import { TabGroupAsyncExample } from './tab-group-async/tab-group-async-example';
import { TabGroupBadgeExample } from './tab-group-badge/tab-group-badge-example';
import { TabGroupBasicExample } from './tab-group-basic/tab-group-basic-example';
import { TabGroupCustomLabelExample } from './tab-group-custom-label/tab-group-custom-label-example';
import { TabGroupDynamicHeightExample } from './tab-group-dynamic-height/tab-group-dynamic-height-example';
import { TabGroupDynamicExample } from './tab-group-dynamic/tab-group-dynamic-example';
import { TabGroupLazyLoadedExample } from './tab-group-lazy-loaded/tab-group-lazy-loaded-example';
import { TabGroupPreserveContentExample } from './tab-group-preserve-content/tab-group-preserve-content-example';
import { TabNavBarBasicExample } from './tab-nav-bar-basic/tab-nav-bar-basic-example';

export {
  TabGroupAsyncExample,
  TabGroupBadgeExample,
  TabGroupBasicExample,
  TabGroupCustomLabelExample,
  TabGroupDynamicExample,
  TabGroupDynamicHeightExample,
  TabGroupLazyLoadedExample,
  TabNavBarBasicExample,
  TabGroupPreserveContentExample,
};

const EXAMPLES = [
  TabGroupAsyncExample,
  TabGroupBadgeExample,
  TabGroupBasicExample,
  TabGroupCustomLabelExample,
  TabGroupDynamicExample,
  TabGroupDynamicHeightExample,
  TabGroupLazyLoadedExample,
  TabNavBarBasicExample,
  TabGroupPreserveContentExample,
];

@NgModule({
  imports: [
    CommonModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbIconModule,
    SbbBadgeModule,
    SbbInputModule,
    SbbTabsModule,
    ReactiveFormsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TabGroupExamplesModule {}
