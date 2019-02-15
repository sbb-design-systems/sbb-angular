import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckboxComponent } from './checkbox/checkbox.component';
import { IconCheckModule } from '../svg-icons/svg-icons';

@NgModule({
  imports: [
    CommonModule,
    IconCheckModule,
  ],
  declarations: [CheckboxComponent],
  exports: [
    CheckboxComponent
  ]
})
export class CheckboxModule { }
