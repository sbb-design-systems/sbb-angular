import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  SbbDateAdapter,
  SbbNativeDateAdapter,
  SBB_DATE_FORMATS,
  SBB_DATE_PIPE_DATE_FORMATS,
} from '@sbb-esta/angular/core';
import {
  DEC,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  FEB,
  JAN,
  MAR,
  NOV,
} from '@sbb-esta/angular/core/testing';

import { SbbCalendarBody, SbbCalendarCellClassFunction } from '../calendar-body/calendar-body';
import { SbbDateRange } from '../date-range';

import { SbbMonthView } from './month-view';

@Component({
  template: `
    <sbb-month-view
      [(activeDate)]="date"
      [(selected)]="selected"
      [isWeekdaySelectable]="isWeekdaySelectable"
      (selectedWeekdayChange)="selectWeekday($event)"
    ></sbb-month-view>
  `,
  imports: [SbbCalendarBody, SbbMonthView],
  standalone: true,
})
class StandardMonthViewComponent {
  date = new Date(2017, JAN, 5);
  selected = new Date(2017, JAN, 10);
  weekday: number | null = -1;
  isWeekdaySelectable = true;
  selectWeekday = (w: number | null) => (this.weekday = w);
}

@Component({
  template: ` <sbb-month-view [activeDate]="activeDate" [dateRange]="dateRange"></sbb-month-view> `,
  imports: [SbbCalendarBody, SbbMonthView],
  standalone: true,
})
class MonthViewWithDateRangeComponent {
  activeDate = new Date(2022, NOV, 1);
  dateRange: SbbDateRange<Date> = new SbbDateRange(new Date(2022, NOV, 1), new Date(2022, NOV, 9));
}

@Component({
  template: `
    <sbb-month-view [activeDate]="activeDate" [dateFilter]="dateFilter"></sbb-month-view>
  `,
  imports: [SbbCalendarBody, SbbMonthView],
  standalone: true,
})
class MonthViewWithDateFilterComponent {
  activeDate = new Date(2017, JAN, 1);
  dateFilter(date: Date) {
    return date.getDate() % 2 === 0;
  }
}

@Component({
  template: `<sbb-month-view [activeDate]="activeDate" [dateClass]="dateClass"></sbb-month-view>`,
  imports: [SbbCalendarBody, SbbMonthView],
  standalone: true,
})
class MonthViewWithDateClassComponent {
  activeDate = new Date(2017, JAN, 1);
  dateClass(date: Date) {
    return date.getDate() % 2 === 0 ? 'even' : undefined;
  }
}

@Component({
  template: `<sbb-month-view
    [isWeekdaySelectable]="isWeekdaySelectable"
    [activeDate]="date"
    showWeekNumbers="true"
    [dateClass]="dateClass"
  ></sbb-month-view>`,
  imports: [SbbCalendarBody, SbbMonthView],
  standalone: true,
})
class MonthViewComponentWithWeekNumbers {
  @ViewChild(SbbMonthView) monthView: SbbMonthView<Date>;
  date = new Date(2023, JAN, 1);
  isWeekdaySelectable = true;
  dateClass: SbbCalendarCellClassFunction<Date> = (date: Date) =>
    date.getDay() === 0 ? 'custom-date-class' : '';
}

describe('SbbMonthView', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SbbCalendarBody,
        SbbMonthView,
        // Test components.
        StandardMonthViewComponent,
        MonthViewWithDateFilterComponent,
        MonthViewWithDateClassComponent,
        MonthViewWithDateRangeComponent,
        MonthViewComponentWithWeekNumbers,
      ],
      providers: [
        { provide: SbbDateAdapter, useClass: SbbNativeDateAdapter },
        { provide: SBB_DATE_FORMATS, useValue: SBB_DATE_PIPE_DATE_FORMATS },
      ],
    }).compileComponents();
  }));

  describe('standard month view', () => {
    let fixture: ComponentFixture<StandardMonthViewComponent>;
    let testComponent: StandardMonthViewComponent;
    let monthViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardMonthViewComponent);
      fixture.detectChanges();

      const monthViewDebugElement = fixture.debugElement.query(By.directive(SbbMonthView));
      monthViewNativeElement = monthViewDebugElement.nativeElement;
      testComponent = fixture.componentInstance;
    });

    it('has 31 days', () => {
      // tslint:disable-next-line:no-non-null-assertion
      const cellEls = monthViewNativeElement.querySelectorAll('.sbb-calendar-body-cell')!;
      expect(cellEls.length).toBe(31);
    });

    it('shows selected date if in same month', () => {
      // tslint:disable-next-line:no-non-null-assertion
      const selectedEl = monthViewNativeElement.querySelector('.sbb-calendar-body-selected')!;
      expect(selectedEl.textContent!.trim()).toBe('10');
    });

    it('does not show selected date if in different month', () => {
      testComponent.selected = new Date(2017, MAR, 10);
      fixture.detectChanges();

      const selectedEl = monthViewNativeElement.querySelector('.sbb-calendar-body-selected');
      expect(selectedEl).toBeNull();
    });

    it('fires selected change event on cell clicked', () => {
      const cellEls = monthViewNativeElement.querySelectorAll('.sbb-calendar-body-cell');
      (cellEls[cellEls.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      // tslint:disable-next-line:no-non-null-assertion
      const selectedEl = monthViewNativeElement.querySelector('.sbb-calendar-body-selected')!;
      expect(selectedEl.textContent!.trim()).toBe('31');
    });

    it('should mark active date', () => {
      const cellEls = monthViewNativeElement.querySelectorAll('.sbb-calendar-body-cell');
      expect((cellEls[4] as HTMLElement).innerText.trim()).toBe('5');
      expect(cellEls[4].classList).toContain('sbb-calendar-body-active');
    });

    it('should emit the clicked weekday', () => {
      const weekButtons = monthViewNativeElement.querySelectorAll(
        'button.sbb-calendar-body-weekday',
      );
      (weekButtons[0] as HTMLElement).click(); // Monday
      expect(testComponent.weekday).toEqual(1);

      (weekButtons[weekButtons.length - 1] as HTMLElement).click(); // Sunday
      expect(testComponent.weekday).toEqual(0);
    });

    describe('a11y', () => {
      describe('calendar body', () => {
        let calendarBodyEl: HTMLElement;
        let calendarInstance: StandardMonthViewComponent;

        beforeEach(() => {
          calendarInstance = fixture.componentInstance;
          calendarBodyEl = fixture.debugElement.nativeElement.querySelector(
            '.sbb-calendar-body',
          ) as HTMLElement;
          expect(calendarBodyEl).not.toBeNull();
          fixture.componentInstance.date = new Date(2017, JAN, 5);
          dispatchFakeEvent(calendarBodyEl, 'focus');
          fixture.detectChanges();
        });

        it('should decrement date on left arrow press', () => {
          dispatchKeyboardEvent(calendarBodyEl, 'keydown', LEFT_ARROW);
          fixture.detectChanges();
          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 4));

          calendarInstance.date = new Date(2017, JAN, 1);
          fixture.detectChanges();

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', LEFT_ARROW);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2016, DEC, 31));
        });

        it('should increment date on right arrow press', () => {
          dispatchKeyboardEvent(calendarBodyEl, 'keydown', RIGHT_ARROW);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 6));

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', RIGHT_ARROW);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 7));
        });

        it('should go up a row on up arrow press', () => {
          dispatchKeyboardEvent(calendarBodyEl, 'keydown', UP_ARROW);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2016, DEC, 29));

          calendarInstance.date = new Date(2017, JAN, 7);
          fixture.detectChanges();

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', UP_ARROW);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2016, DEC, 31));
        });

        it('should go down a row on down arrow press', () => {
          dispatchKeyboardEvent(calendarBodyEl, 'keydown', DOWN_ARROW);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 12));

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', DOWN_ARROW);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 19));
        });

        it('should go to beginning of the month on home press', () => {
          dispatchKeyboardEvent(calendarBodyEl, 'keydown', HOME);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 1));

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', HOME);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 1));
        });

        it('should go to end of the month on end press', () => {
          calendarInstance.date = new Date(2017, JAN, 10);

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', END);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 31));

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', END);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 31));
        });

        it('should go back one month on page up press', () => {
          dispatchKeyboardEvent(calendarBodyEl, 'keydown', PAGE_UP);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2016, DEC, 5));

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', PAGE_UP);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2016, NOV, 5));
        });

        it('should go forward one month on page down press', () => {
          dispatchKeyboardEvent(calendarBodyEl, 'keydown', PAGE_DOWN);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, FEB, 5));

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', PAGE_DOWN);
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, MAR, 5));
        });

        it('should select active date on enter', () => {
          dispatchKeyboardEvent(calendarBodyEl, 'keydown', LEFT_ARROW);
          fixture.detectChanges();

          expect(testComponent.selected).toEqual(new Date(2017, JAN, 10));

          dispatchKeyboardEvent(calendarBodyEl, 'keydown', ENTER);
          fixture.detectChanges();

          expect(testComponent.selected).toEqual(new Date(2017, JAN, 4));
        });

        it('should go to month that is focused', () => {
          const jan11Cell = fixture.debugElement.nativeElement.querySelector(
            '[data-sbb-row="2"][data-sbb-col="2"] button',
          ) as HTMLElement;

          dispatchFakeEvent(jan11Cell, 'focus');
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 11));
        });

        it('should not call `.focus()` when the active date is focused', () => {
          const jan5Cell = fixture.debugElement.nativeElement.querySelector(
            '[data-sbb-row="1"][data-sbb-col="3"] button',
          ) as HTMLElement;
          const focusSpy = (jan5Cell.focus = jasmine.createSpy('cellFocused'));

          dispatchFakeEvent(jan5Cell, 'focus');
          fixture.detectChanges();

          expect(calendarInstance.date).toEqual(new Date(2017, JAN, 5));
          expect(focusSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('month view with date range', () => {
    const rangeSelector =
      '.sbb-calendar-body-range-background, .sbb-calendar-body-selected-begin, .sbb-calendar-body-selected-end';
    let fixture: ComponentFixture<MonthViewWithDateRangeComponent>;
    let monthViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(MonthViewWithDateRangeComponent);
      const monthViewDebugElement = fixture.debugElement.query(By.directive(SbbMonthView))!;
      monthViewNativeElement = monthViewDebugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should display the date range', () => {
      const cells = monthViewNativeElement.querySelectorAll(rangeSelector);
      expect(cells.length).toBe(9);
    });

    it('should update the date range', () => {
      fixture.componentInstance.dateRange = new SbbDateRange(
        new Date(2022, NOV, 15),
        new Date(2022, NOV, 20),
      );
      fixture.detectChanges();

      const cells = monthViewNativeElement.querySelectorAll(rangeSelector);
      expect(cells.length).toBe(6);
    });
  });

  describe('month view with custom date classes', () => {
    let fixture: ComponentFixture<MonthViewWithDateClassComponent>;
    let monthViewNativeElement: Element;
    let dateClassSpy: jasmine.Spy;

    beforeEach(() => {
      fixture = TestBed.createComponent(MonthViewWithDateClassComponent);
      dateClassSpy = spyOn(fixture.componentInstance, 'dateClass').and.callThrough();
      fixture.detectChanges();

      const monthViewDebugElement = fixture.debugElement.query(By.directive(SbbMonthView))!;
      monthViewNativeElement = monthViewDebugElement.nativeElement;
    });

    it('should be able to add a custom class to some dates', () => {
      const cells = monthViewNativeElement.querySelectorAll('.sbb-calendar-body-cell');
      expect(cells[0].classList).not.toContain('even');
      expect(cells[1].classList).toContain('even');
    });

    it('should call dateClass with the correct view name', () => {
      expect(dateClassSpy).toHaveBeenCalledWith(jasmine.any(Date));
    });
  });

  describe('month view with date filter', () => {
    let fixture: ComponentFixture<MonthViewWithDateFilterComponent>;
    let monthViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(MonthViewWithDateFilterComponent);
      fixture.detectChanges();

      const monthViewDebugElement = fixture.debugElement.query(By.directive(SbbMonthView));
      monthViewNativeElement = monthViewDebugElement.nativeElement;
    });

    it('should disable filtered dates', () => {
      const cells = monthViewNativeElement.querySelectorAll('.sbb-calendar-body-cell');
      expect(cells[0].classList).toContain('sbb-calendar-body-disabled');
      expect(cells[1].classList).not.toContain('sbb-calendar-body-disabled');
    });
  });

  describe('month view component with week numbers', () => {
    // See explanation in month-view.ts (search 'fixFirstWeekOfYear').
    let fixture: ComponentFixture<MonthViewComponentWithWeekNumbers>;

    beforeEach(() => {
      fixture = TestBed.createComponent(MonthViewComponentWithWeekNumbers);
      fixture.detectChanges();
    });

    it('should display the correct week numbers if first day of year is a Sunday', () => {
      expect(fixture.componentInstance.monthView._dateAdapter.getFirstDayOfWeek()).toBe(1);
      expect(fixture.componentInstance.monthView.weeksInMonth).toEqual([52, 1, 2, 3, 4, 5]);
    });

    it('should update the dateClass function', () => {
      expect(fixture.nativeElement.querySelectorAll('.custom-date-class').length).toBe(5);

      fixture.componentInstance.dateClass = (date: Date) =>
        date.getDate() === 1 ? 'another-custom-class' : ''; // highlight the first day
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('.custom-date-class').length).toBe(0);
      expect(fixture.nativeElement.querySelectorAll('.another-custom-class').length).toBe(1);
    });
  });
});
