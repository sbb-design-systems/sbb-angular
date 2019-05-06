import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextareaComponent } from './textarea/textarea.component';

@NgModule({
  imports: [CommonModule, TextFieldModule],
  declarations: [TextareaComponent],
  exports: [TextareaComponent]
})
export class TextareaModule {}
