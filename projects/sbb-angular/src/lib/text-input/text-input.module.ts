import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from './input-field/input-field.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InputFieldComponent],
  exports: [InputFieldComponent]
})
export class TextInputModule { }
