import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';

import { SimpleContextmenuComponent } from './simple-contextmenu/simple-contextmenu.component';

const EXAMPLES = [SimpleContextmenuComponent];

@NgModule({
  imports: [CommonModule, ContextmenuModule, DropdownModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class ContextmenuExamplesModule {}
