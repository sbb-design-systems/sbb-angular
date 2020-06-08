import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule } from '@sbb-esta/angular-public/badge';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';

import { provideExamples } from '../../../shared/example-provider';

import { BadgeExampleComponent } from './badge-example/badge-example.component';

const EXAMPLES = [BadgeExampleComponent];

const EXAMPLE_INDEX = {
  'badge-example': BadgeExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BadgeModule, CheckboxModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'badge', EXAMPLE_INDEX)],
})
export class BadgeExamplesModule {}
