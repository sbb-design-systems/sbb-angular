import { CdkTrapFocus } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { SbbCalendar } from '../calendar/calendar';
import { SbbDatepicker } from '../datepicker/datepicker';

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * SbbCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  selector: 'sbb-datepicker-content',
  templateUrl: 'datepicker-content.html',
  styleUrls: ['datepicker-content.css'],
  exportAs: 'sbbDatepickerContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-datepicker-content',
  },
  imports: [SbbCalendar, CdkTrapFocus],
})
export class SbbDatepickerContent<D> implements AfterViewInit {
  /** Reference to the internal calendar component. */
  @ViewChild(SbbCalendar, { static: true }) calendar: SbbCalendar<D>;

  /** Reference to the datepicker that created the overlay. */
  datepicker: SbbDatepicker<D>;

  /** Whether the datepicker is above or below the input. */
  isAbove: boolean;

  /** Id of the label for the `role="dialog"` element. */
  _dialogLabelId: string | null;

  ngAfterViewInit() {
    this.calendar.focusActiveCell();
  }
}
