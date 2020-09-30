import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { SbbDropdownModule } from '@sbb-esta/angular-business/dropdown';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { provideExamples } from '../../../shared/example-provider';

import { ContextmenuWithIconsExampleComponent } from './contextmenu-with-icons-example/contextmenu-with-icons-example.component';
import { SimpleContextmenuExampleComponent } from './simple-contextmenu-example/simple-contextmenu-example.component';

const EXAMPLES = [ContextmenuWithIconsExampleComponent, SimpleContextmenuExampleComponent];

const EXAMPLE_INDEX = {
  'simple-contextmenu-example': SimpleContextmenuExampleComponent,
  'contextmenu-with-icons-example': ContextmenuWithIconsExampleComponent,
};

@NgModule({
  imports: [CommonModule, SbbContextmenuModule, SbbDropdownModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'contextmenu', EXAMPLE_INDEX)],
})
export class ContextmenuExamplesModule {}
