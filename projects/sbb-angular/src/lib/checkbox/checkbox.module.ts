import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckboxComponent } from './checkbox/checkbox.component';
import { IconTickModule } from 'sbb-angular-icons';

@NgModule({
  imports: [
    CommonModule,
    IconTickModule,
  ],
  declarations: [CheckboxComponent],
  exports: [
    CheckboxComponent
  ]
})
export class CheckboxModule { }
