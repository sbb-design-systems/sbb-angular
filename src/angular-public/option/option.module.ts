import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbOptionGroup } from './option-group/option-group.component';
import { SbbOption } from './option/option.component';
import { SbbPseudoCheckbox } from './option/pseudo-checkbox';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbOption, SbbOptionGroup, SbbPseudoCheckbox],
  exports: [SbbOption, SbbOptionGroup, SbbPseudoCheckbox],
})
export class SbbOptionModule {}
