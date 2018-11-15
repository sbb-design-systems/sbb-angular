import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeInputDirective } from './time-input/time-input.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TimeInputDirective],
  exports: [TimeInputDirective]

})
export class TimeInputModule {
}
