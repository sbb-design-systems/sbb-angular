import { Component, AfterViewInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { CalendarComponent } from '../calendar/calendar.component';

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  selector: 'sbb-datepicker-content',
  templateUrl: 'datepicker-content.component.html',
  styleUrls: ['datepicker-content.component.scss'],
  exportAs: 'sbbDatepickerContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerContentComponent<D> implements AfterViewInit {

  @HostBinding('class') cssClass = 'sbb-datepicker-content';

  /** Reference to the internal calendar component. */
  @ViewChild(CalendarComponent) _calendar: CalendarComponent<D>;

  /** Reference to the datepicker that created the overlay. */
  datepicker: DatepickerComponent<D>;

  /** Whether the datepicker is above or below the input. */
  _isAbove: boolean;

  ngAfterViewInit() {
    this._calendar.focusActiveCell();
  }
}
