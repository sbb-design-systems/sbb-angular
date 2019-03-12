import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './label/label.component';
import { FieldComponent } from './field/field.component';
import { FormErrorDirective } from './form-error/form-error.directive';
import { InputModule } from '../input/input.module';

@NgModule({
  imports: [
    CommonModule,
    InputModule,
  ],
  declarations: [
    FieldComponent,
    FormErrorDirective,
    LabelComponent,
  ],
  exports: [
    FieldComponent,
    FormErrorDirective,
    LabelComponent,
    InputModule,
  ]
})
export class FieldModule { }
