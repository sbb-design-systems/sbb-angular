import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { ɵRadioButtonModule } from '@sbb-esta/angular-core/radio-button';

import { ToggleOptionComponent } from './toggle-option/toggle-option.component';
import { ToggleComponent } from './toggle/toggle.component';

@NgModule({
  declarations: [ToggleComponent, ToggleOptionComponent],
  imports: [CommonModule, IconDirectiveModule, ɵRadioButtonModule],
  exports: [ToggleComponent, ToggleOptionComponent, IconDirectiveModule, ɵRadioButtonModule]
})
export class ToggleModule {}
