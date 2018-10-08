import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaComponent } from './textarea/textarea.component';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  imports: [
    CommonModule,
    TextFieldModule
  ],
  declarations: [TextareaComponent],
  exports: [TextareaComponent]
})
export class TextareaModule { }
