import { NgModule } from '@angular/core';

import { TimeInputDirective } from './time-input/time-input.directive';

@NgModule({
  declarations: [TimeInputDirective],
  exports: [TimeInputDirective],
})
export class TimeInputModule {}
