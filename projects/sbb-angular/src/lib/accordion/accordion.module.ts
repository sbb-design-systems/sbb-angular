import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { AccordionComponent } from './accordion/accordion.component';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { ExpansionPanelHeaderComponent } from './expansion-panel-header/expansion-panel-header.component';
import { ExpansionPanelContentDirective } from './expansion-panel/expansion-panel-content';


@NgModule({
  imports: [
    CommonModule,
    CdkAccordionModule,
    PortalModule,
    IconCommonModule
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
