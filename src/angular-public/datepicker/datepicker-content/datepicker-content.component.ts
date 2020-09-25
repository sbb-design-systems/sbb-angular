import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { SbbCalendar } from '../calendar/calendar.component';
import { SbbDatepicker } from '../datepicker/datepicker.component';

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * SbbCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  selector: 'sbb-datepicker-content',
  templateUrl: 'datepicker-content.component.html',
  styleUrls: ['datepicker-content.component.css'],
  exportAs: 'sbbDatepickerContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-datepicker-content',
  },
})
export class SbbDatepickerContent<D> implements AfterViewInit {
  /**
   * @deprecated internal detail
   */
  cssClass = true;

  /** Reference to the internal calendar component. */
  @ViewChild(SbbCalendar, { static: true }) calendar: SbbCalendar<D>;

  /** Reference to the datepicker that created the overlay. */
  datepicker: SbbDatepicker<D>;

  /** Whether the datepicker is above or below the input. */
  isAbove: boolean;

  ngAfterViewInit() {
    this.calendar.focusActiveCell();
  }
}
