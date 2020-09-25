import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbInputModule } from '@sbb-esta/angular-public/input';

import { SbbField } from './field/field.component';
import { SbbFormError } from './form-error/form-error.directive';
import { SbbLabel } from './label/label.component';

@NgModule({
  imports: [CommonModule, SbbInputModule],
  declarations: [SbbField, SbbFormError, SbbLabel],
  exports: [SbbField, SbbFormError, SbbLabel, SbbInputModule],
})
export class SbbFieldModule {}
