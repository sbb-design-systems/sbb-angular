import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconUserModule } from '@sbb-esta/angular-icons/user';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { provideExamples } from '../../../shared/example-provider';

import { DropdownExampleComponent } from './dropdown-example/dropdown-example.component';

const EXAMPLES = [DropdownExampleComponent];

const EXAMPLE_INDEX = {
  'dropdown-example': DropdownExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, IconUserModule, ButtonModule, DropdownModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'dropdown', EXAMPLE_INDEX)],
})
export class DropdownExamplesModule {}
