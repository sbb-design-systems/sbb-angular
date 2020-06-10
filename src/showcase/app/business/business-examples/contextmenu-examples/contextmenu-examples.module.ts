import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';

import { provideExamples } from '../../../shared/example-provider';

import { SimpleContextmenuExampleComponent } from './simple-contextmenu-example/simple-contextmenu-example.component';

const EXAMPLES = [SimpleContextmenuExampleComponent];

const EXAMPLE_INDEX = {
  'simple-contextmenu-example': SimpleContextmenuExampleComponent,
};

@NgModule({
  imports: [CommonModule, ContextmenuModule, DropdownModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'contextmenu', EXAMPLE_INDEX)],
})
export class ContextmenuExamplesModule {}
