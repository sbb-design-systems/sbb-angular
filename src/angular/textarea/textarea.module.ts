import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbTextarea } from './textarea/textarea.component';

@NgModule({
  imports: [CommonModule, TextFieldModule],
  declarations: [SbbTextarea],
  exports: [SbbTextarea],
})
export class SbbTextareaModule {}
