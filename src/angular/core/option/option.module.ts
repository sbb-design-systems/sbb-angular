import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbOptgroup } from './optgroup/optgroup';
import { SbbOption } from './option/option';
import { SbbPseudoCheckbox } from './option/pseudo-checkbox';

@NgModule({
  imports: [CommonModule],
  declarations: [SbbOption, SbbOptgroup, SbbPseudoCheckbox],
  exports: [SbbOption, SbbOptgroup, SbbPseudoCheckbox],
})
export class SbbOptionModule {}
