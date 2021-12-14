import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbTextarea } from './textarea/textarea';

@NgModule({
  imports: [CommonModule, TextFieldModule, SbbCommonModule],
  declarations: [SbbTextarea],
  exports: [SbbTextarea],
})
export class SbbTextareaModule {}
