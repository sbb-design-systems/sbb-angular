import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbSidebarModule } from '@sbb-esta/angular/sidebar';

import { IconSidebarExample } from './icon-sidebar/icon-sidebar-example';
import { SidebarExample } from './sidebar/sidebar-example';

export { SidebarExample, IconSidebarExample };

const EXAMPLES = [SidebarExample, IconSidebarExample];

@NgModule({
  imports: [
    CommonModule,
    SbbSidebarModule,
    SbbIconModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbButtonModule,
    SbbAccordionModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class SidebarExamplesModule {}
