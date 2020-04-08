import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconTickModule } from '@sbb-esta/angular-icons/status';

import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  imports: [CommonModule, IconTickModule],
  declarations: [CheckboxComponent],
  exports: [CheckboxComponent]
})
export class CheckboxModule {}
