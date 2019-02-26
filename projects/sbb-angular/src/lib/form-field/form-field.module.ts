import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './label/label.component';
import { NativeInputDirective } from './native-input/native-input.directive';
import { FormFieldComponent } from './form-field/form-field.component';
import { FormErrorDirective } from './form-error/form-error.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormFieldComponent, FormErrorDirective, LabelComponent, NativeInputDirective],
  exports: [FormFieldComponent, FormErrorDirective, LabelComponent, NativeInputDirective]
})
export class FormFieldModule { }
