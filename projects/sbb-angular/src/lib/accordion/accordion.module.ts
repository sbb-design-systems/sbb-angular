/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionDirective } from './accordion/accordion.directive';
import { SbbExpansionPanel, SbbExpansionPanelActionRow } from './accordion-panel/accordion-panel.component';
import {
  AccordionPanelHeader,
  SbbExpansionPanelTitle,
  SbbExpansionPanelDescription } from './accordion-header/accordion-header.component';
import { SbbExpansionPanelContent } from './accordion-panel/accordion-panel-content';


@NgModule({
  imports: [CommonModule, CdkAccordionModule, PortalModule],
  exports: [
    AccordionDirective,
    SbbExpansionPanel,
    SbbExpansionPanelActionRow,
    AccordionPanelHeader,
    SbbExpansionPanelTitle,
    SbbExpansionPanelDescription,
    SbbExpansionPanelContent
  ],
  declarations: [
    AccordionDirective,
    SbbExpansionPanel,
    SbbExpansionPanelActionRow,
    AccordionPanelHeader,
    SbbExpansionPanelTitle,
    SbbExpansionPanelDescription,
    SbbExpansionPanelContent
  ],
})
export class AccordionModule { }
