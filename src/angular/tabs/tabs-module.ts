import { A11yModule } from '@angular/cdk/a11y';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbTab } from './tab';
import { SbbTabBody, SbbTabBodyPortal } from './tab-body';
import { SbbTabContent } from './tab-content';
import { SbbTabGroup } from './tab-group';
import { SbbTabHeader } from './tab-header';
import { SbbTabLabel } from './tab-label';
import { SbbTabLabelWrapper } from './tab-label-wrapper';
import { SbbTabLink, SbbTabNav } from './tab-nav-bar';

@NgModule({
  imports: [CommonModule, PortalModule, ObserversModule, A11yModule, CdkScrollableModule],
  // Don't export all components because some are only to be used internally.
  exports: [SbbTabGroup, SbbTabLabel, SbbTab, SbbTabNav, SbbTabLink, SbbTabContent],
  declarations: [
    SbbTabGroup,
    SbbTabLabel,
    SbbTab,
    SbbTabLabelWrapper,
    SbbTabNav,
    SbbTabLink,
    SbbTabBody,
    SbbTabBodyPortal,
    SbbTabHeader,
    SbbTabContent,
  ],
})
export class SbbTabsModule {}
