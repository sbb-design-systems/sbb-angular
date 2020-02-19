import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconTickModule } from '@sbb-esta/angular-icons';

import { OptionGroupComponent } from './option-group/option-group.component';
import { OptionComponent } from './option/option.component';
import { PseudoCheckboxComponent } from './option/pseudo-checkbox';

@NgModule({
  imports: [CommonModule, IconTickModule],
  declarations: [OptionComponent, OptionGroupComponent, PseudoCheckboxComponent],
  exports: [OptionComponent, OptionGroupComponent, PseudoCheckboxComponent]
})
export class OptionModule {}
