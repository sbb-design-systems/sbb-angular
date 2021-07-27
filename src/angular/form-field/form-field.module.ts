import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbError } from './error';
import { SbbFormField } from './form-field';
import { SbbLabel } from './label';

@NgModule({
  imports: [CommonModule],
  declarations: [SbbFormField, SbbError, SbbLabel],
  exports: [SbbFormField, SbbError, SbbLabel],
})
export class SbbFormFieldModule {}
