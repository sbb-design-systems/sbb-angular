import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { ɵRadioButtonModule } from '@sbb-esta/angular-core/radio-button';

import { SbbToggleOption } from './toggle-option/toggle-option.component';
import { SbbToggle } from './toggle/toggle.component';

@NgModule({
  declarations: [SbbToggle, SbbToggleOption],
  imports: [CommonModule, SbbIconDirectiveModule, ɵRadioButtonModule],
  exports: [SbbToggle, SbbToggleOption, SbbIconDirectiveModule, ɵRadioButtonModule],
})
export class SbbToggleModule {}
