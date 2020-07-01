import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

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
    CheckboxModule,
    FieldModule,
    TabsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'tabs', EXAMPLE_INDEX)],
})
export class TabsExamplesModule {}
