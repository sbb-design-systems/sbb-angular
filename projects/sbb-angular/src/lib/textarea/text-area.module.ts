import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaBasicComponent } from './textarea-basic/textarea-basic.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [TextareaBasicComponent],
  exports: [TextareaBasicComponent]
})
export class TextAreaModule { }
