import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbError } from './error';
import { SbbFormField } from './form-field';
import { SbbInputModule } from './input.module';
import { SbbLabel } from './label';

@NgModule({
  imports: [CommonModule, SbbInputModule],
  declarations: [SbbFormField, SbbError, SbbLabel],
  exports: [SbbFormField, SbbError, SbbLabel, SbbInputModule],
})
export class SbbFormFieldModule {}
