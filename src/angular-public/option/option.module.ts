import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbOptionGroup } from './option-group/option-group.component';
import { SbbOption } from './option/option.component';
import { SbbPseudoCheckbox } from './option/pseudo-checkbox';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbOption, SbbOptionGroup, SbbPseudoCheckbox],
  exports: [SbbOption, SbbOptionGroup, SbbPseudoCheckbox],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbOptionModule {}
