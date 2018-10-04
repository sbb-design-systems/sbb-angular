import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaComponent } from './textarea/textarea.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TextareaComponent],
  exports: [TextareaComponent]
})
export class TextareaModule { }
