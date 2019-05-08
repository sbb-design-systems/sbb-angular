import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToggleOptionIconDirective } from './toggle-option/toggle-option-icon.directive';
import { ToggleOptionComponent } from './toggle-option/toggle-option.component';
import { ToggleComponent } from './toggle/toggle.component';

@NgModule({
  declarations: [
    ToggleComponent,
    ToggleOptionComponent,
    ToggleOptionIconDirective
  ],
  imports: [CommonModule],
  exports: [ToggleComponent, ToggleOptionComponent, ToggleOptionIconDirective]
})
export class ToggleModule {}
