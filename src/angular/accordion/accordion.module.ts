import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular/icon';

import { SbbAccordion } from './accordion';
import { SbbExpansionPanelHeader } from './expansion-panel-header/expansion-panel-header';
import { SbbExpansionPanel } from './expansion-panel/expansion-panel';
import { SbbExpansionPanelContent } from './expansion-panel/expansion-panel-content';

@NgModule({
  imports: [CommonModule, CdkAccordionModule, PortalModule, SbbIconModule],
  exports: [SbbAccordion, SbbExpansionPanel, SbbExpansionPanelHeader, SbbExpansionPanelContent],
  declarations: [
    SbbAccordion,
    SbbExpansionPanel,
    SbbExpansionPanelHeader,
    SbbExpansionPanelContent,
  ],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbAccordionModule {}
