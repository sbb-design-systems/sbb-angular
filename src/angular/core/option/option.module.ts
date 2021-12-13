import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbCommonModule } from '../common-behaviors/common.module';

import { SbbOptgroup } from './optgroup';
import { SbbOption } from './option';
import { SbbPseudoCheckbox } from './pseudo-checkbox';

@NgModule({
  imports: [CommonModule, SbbCommonModule],
  declarations: [SbbOption, SbbOptgroup, SbbPseudoCheckbox],
  exports: [SbbOption, SbbOptgroup, SbbPseudoCheckbox],
})
export class SbbOptionModule {}
