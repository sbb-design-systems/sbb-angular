import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAccordionModule } from '@sbb-esta/angular-business/accordion';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { provideExamples } from '../../../shared/example-provider';

import { IconSidebarExampleComponent } from './icon-sidebar-example/icon-sidebar-example.component';
import { SidebarExampleComponent } from './sidebar-example/sidebar-example.component';

const EXAMPLES = [SidebarExampleComponent, IconSidebarExampleComponent];

const EXAMPLE_INDEX = {
  'sidebar-example': SidebarExampleComponent,
  'icon-sidebar-example': IconSidebarExampleComponent,
};

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
  providers: [provideExamples('business', 'sidebar', EXAMPLE_INDEX)],
})
export class SidebarExamplesModule {}
