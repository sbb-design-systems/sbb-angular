import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionComponent } from './accordion/accordion.component';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { ExpansionPanelHeaderComponent } from './expansion-panel-header/expansion-panel-header.component';
import { ExpansionPanelContentDirective } from './expansion-panel/expansion-panel-content';
import { IconPlusModule, IconMinusModule } from '../svg-icons/svg-icons';


@NgModule({
  imports: [
    CommonModule,
    CdkAccordionModule,
    PortalModule,
    IconPlusModule,
    IconMinusModule,
  ],
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
  ],
})
export class AccordionModule { }
