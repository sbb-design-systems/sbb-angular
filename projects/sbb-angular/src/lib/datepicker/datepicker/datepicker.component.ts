import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { DatepickerEmbeddableComponent } from '../datepicker-embeddable/datepicker-embeddable.component';

@Component({
  selector: 'sbb-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent {

  /**
   * Embedded datepicker with calendar header and body, switches for next/prev months and years
   */
  @ViewChild('picker') embeddedDatepicker: DatepickerEmbeddableComponent<Date>;

  @Input()
  set withScrolls(value: boolean) {
    this._withScrolls = value;
  }
  get withScrolls(): boolean {
    return this._withScrolls && !!this.embeddedDatepicker.selected;
  }
  _withScrolls: boolean;

  /**
   * Adds or removes a day when clicking on the arrow buttons on the right/left of the input
   */
  scrollToDay(value: 'left' | 'right') {
    value === 'left' ? this.embeddedDatepicker.prevDay() : this.embeddedDatepicker.nextDay();

  }

}
