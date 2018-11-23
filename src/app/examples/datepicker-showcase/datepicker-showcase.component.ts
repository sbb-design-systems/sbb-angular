import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-datepicker-showcase',
  templateUrl: './datepicker-showcase.component.html',
  styleUrls: ['./datepicker-showcase.component.scss']
})
export class DatepickerShowcaseComponent implements OnInit {
  today = new Date();

  minDate = new Date('2018-06-20');
  maxDate = new Date('2018-11-24');

  constructor() { }

  ngOnInit() {
  }


}
