import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbFieldModule } from '@sbb-esta/angular-public/field';
import { SbbTabsModule } from '@sbb-esta/angular-public/tabs';

import { provideExamples } from '../../../shared/example-provider';

import { TabsExampleComponent } from './tabs-example/tabs-example.component';

const EXAMPLES = [TabsExampleComponent];

const EXAMPLE_INDEX = {
  'tabs-example': TabsExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbFieldModule,
    SbbTabsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'tabs', EXAMPLE_INDEX)],
})
export class TabsExamplesModule {}
