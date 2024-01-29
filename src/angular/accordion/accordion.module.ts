import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbAccordion } from './accordion';
import { SbbExpansionPanel } from './expansion-panel';
import { SbbExpansionPanelContent } from './expansion-panel-content';
import { SbbExpansionPanelHeader } from './expansion-panel-header';

@NgModule({
  imports: [
    CommonModule,
    CdkAccordionModule,
    PortalModule,
    SbbCommonModule,
    SbbIconModule,
    SbbAccordion,
    SbbExpansionPanel,
    SbbExpansionPanelHeader,
    SbbExpansionPanelContent,
  ],
  exports: [SbbAccordion, SbbExpansionPanel, SbbExpansionPanelHeader, SbbExpansionPanelContent],
})
export class SbbAccordionModule {}
