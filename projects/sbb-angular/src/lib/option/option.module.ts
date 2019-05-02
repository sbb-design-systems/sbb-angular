import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconTickModule } from 'sbb-angular-icons';

import { OptionGroupComponent } from './option-group/option-group.component';
import { HighlightPipe } from './option/highlight.pipe';
import { OptionComponent } from './option/option.component';
import { PseudoCheckboxComponent } from './option/pseudo-checkbox';

@NgModule({
  imports: [
    CommonModule,
    IconTickModule,
  ],
  declarations: [
    OptionComponent,
    OptionGroupComponent,
    HighlightPipe,
    PseudoCheckboxComponent
  ],
  exports: [
    OptionComponent,
    OptionGroupComponent,
    HighlightPipe,
    PseudoCheckboxComponent
  ]
})
export class OptionModule { }
