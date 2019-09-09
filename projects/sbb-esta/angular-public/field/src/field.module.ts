import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputModule } from '@sbb-esta/angular-public/input';

import { FieldComponent } from './field/field.component';
import { FormErrorDirective } from './form-error/form-error.directive';
import { LabelComponent } from './label/label.component';

@NgModule({
  imports: [CommonModule, InputModule],
  declarations: [FieldComponent, FormErrorDirective, LabelComponent],
  exports: [FieldComponent, FormErrorDirective, LabelComponent, InputModule]
})
export class FieldModule {}
