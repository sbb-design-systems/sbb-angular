import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { SbbDropdownModule } from '@sbb-esta/angular-business/dropdown';

import { provideExamples } from '../../../shared/example-provider';

import { SimpleContextmenuExampleComponent } from './simple-contextmenu-example/simple-contextmenu-example.component';

const EXAMPLES = [SimpleContextmenuExampleComponent];

const EXAMPLE_INDEX = {
  'simple-contextmenu-example': SimpleContextmenuExampleComponent,
};

@NgModule({
  imports: [CommonModule, SbbContextmenuModule, SbbDropdownModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'contextmenu', EXAMPLE_INDEX)],
})
export class ContextmenuExamplesModule {}
