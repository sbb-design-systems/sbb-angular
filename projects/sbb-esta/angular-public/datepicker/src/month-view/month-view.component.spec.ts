import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW
} from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DATE_PIPE_DATE_FORMATS,
  DateAdapter,
  NativeDateAdapter,
  SBB_DATE_FORMATS
} from '@sbb-esta/angular-core/datetime';
import { DEC, FEB, JAN, MAR, NOV } from '@sbb-esta/angular-core/testing';
import { dispatchFakeEvent, dispatchKeyboardEvent } from '@sbb-esta/angular-core/testing';
import { configureTestSuite } from 'ng-bullet';

import { CalendarBodyComponent } from '../calendar-body/calendar-body.component';

import { MonthViewComponent } from './month-view.component';

@Component({
  template: `
    <sbb-month-view [(activeDate)]="date" [(selected)]="selected"></sbb-month-view>
  `
})
class StandardMonthViewComponent {
  date = new Date(2017, JAN, 5);
  selected = new Date(2017, JAN, 10);
}

@Component({
  template: `
    <sbb-month-view [activeDate]="activeDate" [dateFilter]="dateFilter"></sbb-month-view>
  `
})
class MonthViewWithDateFilterComponent {
  activeDate = new Date(2017, JAN, 1);
  dateFilter(date: Date) {
    return date.getDate() % 2 === 0;
  }
}

describe('MonthViewComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarBodyComponent,
        MonthViewComponent,

        // Test components.
        StandardMonthViewComponent,
        MonthViewWithDateFilterComponent
      ],
      providers: [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: SBB_DATE_FORMATS, useValue: DATE_PIPE_DATE_FORMATS }
      ]
    });
  });

  describe('standard month view', () => {
    let fixture: ComponentFixture<StandardMonthViewComponent>;
    let testComponent: StandardMonthViewComponent;
    let monthViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardMonthViewComponent);
      fixture.detectChanges();

      const monthViewDebugElement = fixture.debugElement.query(By.directive(MonthViewComponent));
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
      expect(selectedEl.textContent.trim()).toBe('10');
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
      expect(selectedEl.textContent.trim()).toBe('31');
    });

    it('should mark active date', () => {
      const cellEls = monthViewNativeElement.querySelectorAll('.sbb-calendar-body-cell');
      expect((cellEls[4] as HTMLElement).innerText.trim()).toBe('5');
      expect(cellEls[4].classList).toContain('sbb-calendar-body-active');
    });

    describe('a11y', () => {
      describe('calendar body', () => {
        let calendarBodyEl: HTMLElement;
        let calendarInstance: StandardMonthViewComponent;

        beforeEach(() => {
          calendarInstance = fixture.componentInstance;
          calendarBodyEl = fixture.debugElement.nativeElement.querySelector(
            '.sbb-calendar-body'
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
      });
    });
  });

  describe('month view with date filter', () => {
    let fixture: ComponentFixture<MonthViewWithDateFilterComponent>;
    let monthViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(MonthViewWithDateFilterComponent);
      fixture.detectChanges();

      const monthViewDebugElement = fixture.debugElement.query(By.directive(MonthViewComponent));
      monthViewNativeElement = monthViewDebugElement.nativeElement;
    });

    it('should disable filtered dates', () => {
      const cells = monthViewNativeElement.querySelectorAll('.sbb-calendar-body-cell');
      expect(cells[0].classList).toContain('sbb-calendar-body-disabled');
      expect(cells[1].classList).not.toContain('sbb-calendar-body-disabled');
    });
  });
});
