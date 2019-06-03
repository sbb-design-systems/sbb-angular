import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TimeInputDirective } from './time-input/time-input.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TimeInputDirective],
  exports: [TimeInputDirective]
})
export class TimeInputModule {}
