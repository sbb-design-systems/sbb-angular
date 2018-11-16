import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker/datepicker.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DatepickerComponent],
  exports: [DatepickerComponent]
})
export class DatepickerModule { }
