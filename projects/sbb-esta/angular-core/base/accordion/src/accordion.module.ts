import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconMinusModule, IconPlusModule } from '@sbb-esta/angular-icons';

import { AccordionComponent } from './accordion/accordion.component';
import { ExpansionPanelHeaderComponent } from './expansion-panel-header/expansion-panel-header.component';
import { ExpansionPanelContentDirective } from './expansion-panel/expansion-panel-content';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';

@NgModule({
  imports: [CommonModule, CdkAccordionModule, PortalModule, IconPlusModule, IconMinusModule],
  exports: [
    AccordionComponent,
    ExpansionPanelComponent,
    ExpansionPanelHeaderComponent,
    ExpansionPanelContentDirective
  ],
  declarations: [
    AccordionComponent,
    ExpansionPanelComponent,
    ExpansionPanelHeaderComponent,
    ExpansionPanelContentDirective
  ]
})
export class AccordionModule {}
