import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { OptionGroupComponent } from './option-group/option-group.component';
import { OptionComponent } from './option/option.component';
import { PseudoCheckboxComponent } from './option/pseudo-checkbox';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [OptionComponent, OptionGroupComponent, PseudoCheckboxComponent],
  exports: [OptionComponent, OptionGroupComponent, PseudoCheckboxComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class OptionModule {}
