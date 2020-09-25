import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbInput } from './input/input.directive';

@NgModule({
  declarations: [SbbInput],
  imports: [CommonModule],
  exports: [SbbInput],
})
export class SbbInputModule {}
