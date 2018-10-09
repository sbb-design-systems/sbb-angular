import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from './input-field/input-field.component';
import { SbbFieldComponent } from './sbb-field/sbb-field.component';
import { FormErrorComponent } from './form-error/form-error.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InputFieldComponent, SbbFieldComponent, FormErrorComponent],
  exports: [InputFieldComponent, SbbFieldComponent, FormErrorComponent]
})
export class TextInputModule { }
