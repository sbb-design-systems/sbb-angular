import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [CheckboxComponent],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}
