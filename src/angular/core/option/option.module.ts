import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbOptgroup } from './optgroup';
import { SbbOption } from './option';
import { SbbPseudoCheckbox } from './pseudo-checkbox';

@NgModule({
  imports: [CommonModule],
  declarations: [SbbOption, SbbOptgroup, SbbPseudoCheckbox],
  exports: [SbbOption, SbbOptgroup, SbbPseudoCheckbox],
})
export class SbbOptionModule {}
