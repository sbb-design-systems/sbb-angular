import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbTab } from './tab';
import { SbbTabContent } from './tab-content';
import { SbbTabGroup } from './tab-group';
import { SbbTabLabel } from './tab-label';
import { SbbTabLink, SbbTabNav, SbbTabNavPanel } from './tab-nav-bar';

@NgModule({
  imports: [
    CdkScrollableModule,
    SbbCommonModule,
    SbbIconModule,
    SbbTabGroup,
    SbbTabLabel,
    SbbTab,
    SbbTabNav,
    SbbTabNavPanel,
    SbbTabLink,
    SbbTabContent,
  ],
  // Don't export all components because some are only to be used internally.
  exports: [
    SbbCommonModule,
    SbbTabGroup,
    SbbTabLabel,
    SbbTab,
    SbbTabNav,
    SbbTabNavPanel,
    SbbTabLink,
    SbbTabContent,
  ],
})
export class SbbTabsModule {}
