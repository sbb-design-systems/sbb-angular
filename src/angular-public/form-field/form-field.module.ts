import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbInputModule } from '@sbb-esta/angular-public/input';

import { SbbError } from './error';
import { SbbFormField } from './form-field';
import { SbbLabel } from './label';

@NgModule({
  imports: [CommonModule, SbbInputModule],
  declarations: [SbbFormField, SbbError, SbbLabel],
  exports: [SbbFormField, SbbError, SbbLabel, SbbInputModule],
})
export class SbbFormFieldModule {}
