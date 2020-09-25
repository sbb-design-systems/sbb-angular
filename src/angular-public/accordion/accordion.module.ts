import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbAccordion } from './accordion/accordion.directive';
import { SbbExpansionPanelHeader } from './expansion-panel-header/expansion-panel-header.component';
import { SbbExpansionPanelContent } from './expansion-panel/expansion-panel-content';
import { SbbExpansionPanel } from './expansion-panel/expansion-panel.component';

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
