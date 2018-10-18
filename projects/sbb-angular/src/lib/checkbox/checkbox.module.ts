import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconCommonModule } from '../svg-icons-components';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule
  ],
  declarations: [CheckboxComponent],
  exports: [
    CheckboxComponent
  ]
})
export class CheckboxModule { }
