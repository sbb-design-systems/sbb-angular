import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from './input-field/input-field.component';
import { SbbFieldComponent } from './sbb-field/sbb-field.component';
import { FormErrorComponent } from './form-error/form-error.component';
import { SbbLabelComponent } from './sbb-label/sbb-label.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InputFieldComponent, SbbFieldComponent, FormErrorComponent, SbbLabelComponent],
  exports: [InputFieldComponent, SbbFieldComponent, FormErrorComponent, SbbLabelComponent]
})
export class TextInputModule { }
