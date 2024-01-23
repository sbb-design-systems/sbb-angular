import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbError } from './error';
import { SbbFormField } from './form-field';
import { SbbLabel } from './label';

@NgModule({
  imports: [SbbCommonModule],
  declarations: [SbbFormField, SbbError, SbbLabel],
  exports: [SbbFormField, SbbError, SbbLabel],
})
export class SbbFormFieldModule {}
