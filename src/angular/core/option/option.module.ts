import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbOptgroup } from './option-group/option-group.component';
import { SbbOption } from './option/option.component';
import { SbbPseudoCheckbox } from './option/pseudo-checkbox';

@NgModule({
  imports: [CommonModule],
  declarations: [SbbOption, SbbOptgroup, SbbPseudoCheckbox],
  exports: [SbbOption, SbbOptgroup, SbbPseudoCheckbox],
})
export class SbbOptionModule {}
