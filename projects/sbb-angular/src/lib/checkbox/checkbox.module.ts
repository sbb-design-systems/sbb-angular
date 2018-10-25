import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconCommonModule } from '../svg-icons-components/icon-common.module';
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
