import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconUserModule } from '@sbb-esta/angular-icons/user';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { provideExamples } from '../../../shared/example-provider';

import { DropdownCustomTriggerExampleComponent } from './dropdown-custom-trigger-example/dropdown-custom-trigger-example.component';

const EXAMPLES = [DropdownCustomTriggerExampleComponent];

const EXAMPLE_INDEX = {
  'dropdown-custom-trigger-example': DropdownCustomTriggerExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, IconUserModule, DropdownModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'dropdown', EXAMPLE_INDEX)],
})
export class DropdownExamplesModule {}
