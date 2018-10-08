import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from './input-field/input-field.component';
import { TextFieldComponent } from './text-field/text-field.component';
import { FormErrorComponent } from './form-error/form-error.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InputFieldComponent, TextFieldComponent, FormErrorComponent],
  exports: [InputFieldComponent, TextFieldComponent, FormErrorComponent]
})
export class TextInputModule { }
