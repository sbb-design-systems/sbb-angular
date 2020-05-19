import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';

import { SimpleContextmenuExampleComponent } from './simple-contextmenu-example/simple-contextmenu-example.component';

const EXAMPLES = [SimpleContextmenuExampleComponent];

@NgModule({
  imports: [CommonModule, ContextmenuModule, DropdownModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class ContextmenuExamplesModule {}
