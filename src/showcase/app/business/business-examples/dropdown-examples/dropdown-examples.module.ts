import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';
import { IconUserModule } from '@sbb-esta/angular-icons/user';

import { provideExamples } from '../../../shared/example-provider';

import { DropdownCustomTriggerExampleComponent } from './dropdown-custom-trigger-example/dropdown-custom-trigger-example.component';

const EXAMPLES = [DropdownCustomTriggerExampleComponent];

const EXAMPLE_INDEX = {
  'dropdown-custom-trigger-example': DropdownCustomTriggerExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, DropdownModule, IconUserModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'dropdown', EXAMPLE_INDEX)],
})
export class DropdownExamplesModule {}
