import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconHeartModule } from '@sbb-esta/angular-icons/basic';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { CheckboxPanelModule } from '@sbb-esta/angular-public/checkbox-panel';

import { provideExamples } from '../../../shared/example-provider';

import { CheckboxPanelExampleComponent } from './checkbox-panel-example/checkbox-panel-example.component';

const EXAMPLES = [CheckboxPanelExampleComponent];

const EXAMPLE_INDEX = {
  'checkbox-panel-example': CheckboxPanelExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconHeartModule,
    CheckboxModule,
    CheckboxPanelModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'checkbox', EXAMPLE_INDEX)],
})
export class CheckboxPanelExamplesModule {}
