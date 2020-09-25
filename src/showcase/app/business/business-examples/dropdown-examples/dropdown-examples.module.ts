import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbDropdownModule } from '@sbb-esta/angular-business/dropdown';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { provideExamples } from '../../../shared/example-provider';

import { DropdownCustomTriggerExampleComponent } from './dropdown-custom-trigger-example/dropdown-custom-trigger-example.component';

const EXAMPLES = [DropdownCustomTriggerExampleComponent];

const EXAMPLE_INDEX = {
  'dropdown-custom-trigger-example': DropdownCustomTriggerExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, SbbDropdownModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'dropdown', EXAMPLE_INDEX)],
})
export class DropdownExamplesModule {}
