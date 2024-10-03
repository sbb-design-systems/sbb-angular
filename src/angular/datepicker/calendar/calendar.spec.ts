import { ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DEC,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  FEB,
  JAN,
  JUL,
  NOV,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbCalendarCellClassFunction } from '../calendar-body/calendar-body';
import { SbbCalendar } from '../calendar/calendar';
import { SbbDatepickerModule } from '../datepicker.module';

@Component({
  template: `
    <sbb-calendar
      [startAt]="startDate"
      [(selected)]="selected"
      (yearSelected)="selectedYear = $event"
      (monthSelected)="selectedMonth = $event"
    >
    </sbb-calendar>
  `,
  standalone: true,
  imports: [SbbDatepickerModule],
})
class StandardCalendarComponent {
  selected: Date;
  selectedYear: Date;
  selectedMonth: Date;
  startDate = new Date(2017, JAN, 31);
}

@Component({
  template: `
    <sbb-calendar [startAt]="startAt" [minDate]="minDate" [maxDate]="maxDate"></sbb-calendar>
  `,
  standalone: true,
  imports: [SbbDatepickerModule],
})
class CalendarWithMinMaxComponent {
  startAt: Date;
  minDate = new Date(2016, JAN, 1);
  maxDate = new Date(2018, JAN, 1);
}

@Component({
  template: `
    <sbb-calendar [startAt]="startDate" [(selected)]="selected" [dateFilter]="dateFilter">
    </sbb-calendar>
  `,
  standalone: true,
  imports: [SbbDatepickerModule],
})
class CalendarWithDateFilterComponent {
  selected: Date;
  startDate = new Date(2017, JAN, 1);

  dateFilter(date: Date) {
    return !(date.getDate() % 2) && date.getMonth() !== NOV;
  }
}

@Component({
  template: `
    <sbb-calendar
      [startAt]="startAt"
      (selectedChange)="select($event)"
      [selected]="selected"
      [minDate]="selected"
    >
    </sbb-calendar>
  `,
  standalone: true,
  imports: [SbbDatepickerModule],
})
class CalendarWithSelectableMinDateComponent {
  startAt = new Date(2018, JUL, 0);
  selected: Date;
  minDate: Date;

  constructor() {
    this.select(new Date(2018, JUL, 10));
  }

  select(value: Date) {
    this.minDate = this.selected = value;
  }
}

@Component({
  template: ` <sbb-calendar [dateClass]="dateClass"> </sbb-calendar> `,
  standalone: true,
  imports: [SbbDatepickerModule],
})
class CalendarWithDateClassComponent {
  dateClass: SbbCalendarCellClassFunction<Date>;
}

describe('SbbCalendar', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ imports: [SbbIconTestingModule] });
  }));

  describe('standard calendar', () => {
    let fixture: ComponentFixture<StandardCalendarComponent>;
    let testComponent: StandardCalendarComponent;
    let calendarElement: HTMLElement;
    let calendarInstance: SbbCalendar<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardCalendarComponent);
      fixture.detectChanges();

      const calendarDebugElement = fixture.debugElement.query(By.directive(SbbCalendar));
      calendarElement = calendarDebugElement.nativeElement;

      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it('should select date in month view', () => {
      const monthCells = calendarElement.querySelectorAll('.sbb-calendar-body-cell');
      (monthCells[monthCells.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      expect(testComponent.selected).toEqual(new Date(2017, JAN, 31));
    });

    it('should set all buttons to be `type="button"`', () => {
      const invalidButtons = calendarElement.querySelectorAll('button:not([type="button"])');
      expect(invalidButtons.length).toBe(0);
    });

    it('should complete the stateChanges stream', () => {
      const spy = jasmine.createSpy('complete spy');
      const subscription = calendarInstance.stateChanges.subscribe({
        complete: spy,
      });

      fixture.destroy();

      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });

    describe('a11y', () => {
      describe('calendar body', () => {
        let calendarBodyEl: HTMLElement;

        beforeEach(() => {
          calendarBodyEl = calendarElement.querySelector('.sbb-calendar-content') as HTMLElement;
          expect(calendarBodyEl).not.toBeNull();

          dispatchFakeEvent(calendarBodyEl, 'focus');
          fixture.detectChanges();
        });

        it('should initially set start date active', () => {
          expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));
        });

        it('should make the calendar body focusable', () => {
          expect(calendarBodyEl.getAttribute('tabindex')).toBe('-1');
        });

        it('should not move focus to the active cell on init', waitForAsync(async () => {
          const activeCell =
            // tslint:disable-next-line:no-non-null-assertion
            calendarBodyEl.querySelector('.sbb-calendar-body-active')! as HTMLElement;

          spyOn(activeCell, 'focus').and.callThrough();
          fixture.detectChanges();
          await new Promise((resolve) => setTimeout(resolve));

          expect(activeCell.focus).not.toHaveBeenCalled();
        }));
      });
    });
  });

  describe('calendar with min and max date', () => {
    let fixture: ComponentFixture<CalendarWithMinMaxComponent>;
    let testComponent: CalendarWithMinMaxComponent;
    let calendarElement: HTMLElement;
    let calendarInstance: SbbCalendar<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CalendarWithMinMaxComponent);

      const calendarDebugElement = fixture.debugElement.query(By.directive(SbbCalendar));
      calendarElement = calendarDebugElement.nativeElement;
      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it('should clamp startAt value below min date', () => {
      testComponent.startAt = new Date(2000, JAN, 1);
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 1));
    });

    it('should clamp startAt value above max date', () => {
      testComponent.startAt = new Date(2020, JAN, 1);
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 1));
    });

    it('should not go back past min date', () => {
      testComponent.startAt = new Date(2016, FEB, 1);
      fixture.detectChanges();

      const prevButton = calendarElement.querySelector(
        '.sbb-calendar-controls-button-previous',
      ) as HTMLButtonElement;

      expect(prevButton.disabled).withContext('previous button should not be disabled').toBe(false);
      expect(calendarInstance.activeDate).toEqual(new Date(2016, FEB, 1));

      prevButton.click();
      fixture.detectChanges();

      expect(prevButton.disabled).withContext('previous button should be disabled').toBe(true);
      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 1));

      prevButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 1));
    });

    it('should not go forward past max date', () => {
      testComponent.startAt = new Date(2017, DEC, 1);
      fixture.detectChanges();

      const nextButton = calendarElement.querySelector(
        '.sbb-calendar-controls-button-next',
      ) as HTMLButtonElement;

      expect(nextButton.disabled).withContext('next button should not be disabled').toBe(false);
      expect(calendarInstance.activeDate).toEqual(new Date(2017, DEC, 1));

      nextButton.click();
      fixture.detectChanges();

      expect(nextButton.disabled).withContext('next button should be disabled').toBe(true);
      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 1));

      nextButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 1));
    });

    it('should re-render the month view when the minDate changes', () => {
      fixture.detectChanges();
      spyOn(calendarInstance.monthView, 'init').and.callThrough();

      testComponent.minDate = new Date(2017, NOV, 1);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(calendarInstance.monthView.init).toHaveBeenCalled();
    });

    it('should not re-render the month view when the minDate changes to the same day at a different time', () => {
      fixture.detectChanges();
      spyOn(calendarInstance.monthView, 'init').and.callThrough();

      testComponent.minDate = new Date(2016, JAN, 1, 0, 0, 0, 1);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(calendarInstance.monthView.init).not.toHaveBeenCalled();
    });

    it('should re-render the month view when the maxDate changes', () => {
      fixture.detectChanges();
      spyOn(calendarInstance.monthView, 'init').and.callThrough();

      testComponent.maxDate = new Date(2017, DEC, 1);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(calendarInstance.monthView.init).toHaveBeenCalled();
    });

    it('should update the minDate in the child view if it changed after an interaction', () => {
      fixture.destroy();

      const dynamicFixture = TestBed.createComponent(CalendarWithSelectableMinDateComponent);
      dynamicFixture.detectChanges();

      const calendarDebugElement = dynamicFixture.debugElement.query(By.directive(SbbCalendar));
      const disabledClass = 'sbb-calendar-body-disabled';
      calendarElement = calendarDebugElement.nativeElement;
      calendarInstance = calendarDebugElement.componentInstance;

      let cells = Array.from(calendarElement.querySelectorAll('.sbb-calendar-body-cell'));

      expect(cells.slice(0, 9).every((c) => c.classList.contains(disabledClass)))
        .withContext('Expected dates up to the 10th to be disabled.')
        .toBe(true);

      expect(cells.slice(9).every((c) => c.classList.contains(disabledClass)))
        .withContext('Expected dates after the 10th to be enabled.')
        .toBe(false);
      (cells[14] as HTMLElement).click();
      dynamicFixture.detectChanges();
      cells = Array.from(calendarElement.querySelectorAll('.sbb-calendar-body-cell'));

      expect(cells.slice(0, 14).every((c) => c.classList.contains(disabledClass)))
        .withContext('Expected dates up to the 14th to be disabled.')
        .toBe(true);

      expect(cells.slice(14).every((c) => c.classList.contains(disabledClass)))
        .withContext('Expected dates after the 14th to be enabled.')
        .toBe(false);
    });
  });

  describe('calendar with date filter', () => {
    let fixture: ComponentFixture<CalendarWithDateFilterComponent>;
    let testComponent: CalendarWithDateFilterComponent;
    let calendarElement: HTMLElement;
    let calendarInstance: SbbCalendar<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CalendarWithDateFilterComponent);
      fixture.detectChanges();

      const calendarDebugElement = fixture.debugElement.query(By.directive(SbbCalendar));
      calendarElement = calendarDebugElement.nativeElement;
      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it('should disable and prevent selection of filtered dates', () => {
      const cells = calendarElement.querySelectorAll('.sbb-calendar-body-cell');
      (cells[0] as HTMLElement).click();
      fixture.detectChanges();

      expect(testComponent.selected).toBeFalsy();

      (cells[1] as HTMLElement).click();
      fixture.detectChanges();

      expect(testComponent.selected).toEqual(new Date(2017, JAN, 2));
    });

    describe('a11y', () => {
      let tableBodyEl: HTMLElement;

      beforeEach(() => {
        tableBodyEl = calendarElement.querySelector('.sbb-calendar-body') as HTMLElement;
        expect(tableBodyEl).not.toBeNull();

        dispatchFakeEvent(tableBodyEl, 'focus');
        fixture.detectChanges();
      });

      it('should not allow selection of disabled date in month view', () => {
        expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 1));

        dispatchKeyboardEvent(tableBodyEl, 'keydown', ENTER);
        fixture.detectChanges();

        expect(testComponent.selected).toBeUndefined();
      });
    });
  });

  describe('calendar with dateClass', () => {
    let fixture: ComponentFixture<CalendarWithDateClassComponent>;
    let testComponent: CalendarWithDateClassComponent;
    let calendarInstance: SbbCalendar<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CalendarWithDateClassComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;

      const calendarDebugElement = fixture.debugElement.query(By.directive(SbbCalendar));
      calendarInstance = calendarDebugElement.componentInstance;
    });

    it('should convert the dateClass function into an observable', (doneFn) => {
      testComponent.dateClass = () => 'custom-date-cell-string';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      calendarInstance._dateClassObservable.subscribe((dateClassFn) => {
        expect(dateClassFn(new Date())).toEqual('custom-date-cell-string');
        doneFn();
      });
    });
  });
});
