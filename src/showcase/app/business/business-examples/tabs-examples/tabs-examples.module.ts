import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular-business/form-field';
import { SbbTabsModule } from '@sbb-esta/angular-business/tabs';

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
    SbbFormFieldModule,
    SbbTabsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'tabs', EXAMPLE_INDEX)],
})
export class TabsExamplesModule {}
