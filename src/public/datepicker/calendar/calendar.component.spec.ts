import { ENTER } from '@angular/cdk/keycodes';
import { Component, NgZone } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DEC,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  FEB,
  JAN,
  JUL,
  MockNgZone,
  NOV
} from '@sbb-esta/angular-core/testing';

import { CalendarComponent, DatepickerModule } from '../public-api';

@Component({
  template: `
    <sbb-calendar
      [startAt]="startDate"
      [(selected)]="selected"
      (yearSelected)="selectedYear = $event"
      (monthSelected)="selectedMonth = $event"
    >
    </sbb-calendar>
  `
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
  `
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
  `
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
  `
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

describe('CalendarComponent', () => {
  let zone: MockNgZone;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DatepickerModule],
      declarations: [
        // Test components.
        StandardCalendarComponent,
        CalendarWithMinMaxComponent,
        CalendarWithDateFilterComponent,
        CalendarWithSelectableMinDateComponent
      ],
      providers: [{ provide: NgZone, useFactory: () => (zone = new MockNgZone()) }]
    }).compileComponents();
  }));

  describe('standard calendar', () => {
    let fixture: ComponentFixture<StandardCalendarComponent>;
    let testComponent: StandardCalendarComponent;
    let calendarElement: HTMLElement;
    let calendarInstance: CalendarComponent<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardCalendarComponent);
      fixture.detectChanges();

      const calendarDebugElement = fixture.debugElement.query(By.directive(CalendarComponent));
      calendarElement = calendarDebugElement.nativeElement;

      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it('should be in month view with specified month active', () => {
      expect(calendarInstance.currentView).toBe('month');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));
    });

    it('should select date in month view', () => {
      const monthCells = calendarElement.querySelectorAll('.sbb-calendar-body-cell');
      (monthCells[monthCells.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('month');
      expect(testComponent.selected).toEqual(new Date(2017, JAN, 31));
    });

    it('should set all buttons to be `type="button"`', () => {
      const invalidButtons = calendarElement.querySelectorAll('button:not([type="button"])');
      expect(invalidButtons.length).toBe(0);
    });

    it('should complete the stateChanges stream', () => {
      const spy = jasmine.createSpy('complete spy');
      const subscription = calendarInstance.stateChanges.subscribe({
        complete: spy
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

        it('should not move focus to the active cell on init', () => {
          const activeCell =
            // tslint:disable-next-line:no-non-null-assertion
            calendarBodyEl.querySelector('.sbb-calendar-body-active')! as HTMLElement;

          spyOn(activeCell, 'focus').and.callThrough();
          fixture.detectChanges();
          zone.simulateZoneExit();

          expect(activeCell.focus).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('calendar with min and max date', () => {
    let fixture: ComponentFixture<CalendarWithMinMaxComponent>;
    let testComponent: CalendarWithMinMaxComponent;
    let calendarElement: HTMLElement;
    let calendarInstance: CalendarComponent<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CalendarWithMinMaxComponent);

      const calendarDebugElement = fixture.debugElement.query(By.directive(CalendarComponent));
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
        '.sbb-calendar-controls-left-arrow'
      ) as HTMLButtonElement;

      expect(prevButton.disabled).toBe(false, 'previous button should not be disabled');
      expect(calendarInstance.activeDate).toEqual(new Date(2016, FEB, 1));

      prevButton.click();
      fixture.detectChanges();

      expect(prevButton.disabled).toBe(true, 'previous button should be disabled');
      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 1));

      prevButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 1));
    });

    it('should not go forward past max date', () => {
      testComponent.startAt = new Date(2017, DEC, 1);
      fixture.detectChanges();

      const nextButton = calendarElement.querySelector(
        '.sbb-calendar-controls-right-arrow'
      ) as HTMLButtonElement;

      expect(nextButton.disabled).toBe(false, 'next button should not be disabled');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, DEC, 1));

      nextButton.click();
      fixture.detectChanges();

      expect(nextButton.disabled).toBe(true, 'next button should be disabled');
      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 1));

      nextButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 1));
    });

    it('should re-render the month view when the minDate changes', () => {
      fixture.detectChanges();
      spyOn(calendarInstance.monthView, 'init').and.callThrough();

      testComponent.minDate = new Date(2017, NOV, 1);
      fixture.detectChanges();

      expect(calendarInstance.monthView.init).toHaveBeenCalled();
    });

    it('should re-render the month view when the maxDate changes', () => {
      fixture.detectChanges();
      spyOn(calendarInstance.monthView, 'init').and.callThrough();

      testComponent.maxDate = new Date(2017, DEC, 1);
      fixture.detectChanges();

      expect(calendarInstance.monthView.init).toHaveBeenCalled();
    });

    it('should update the minDate in the child view if it changed after an interaction', () => {
      fixture.destroy();

      const dynamicFixture = TestBed.createComponent(CalendarWithSelectableMinDateComponent);
      dynamicFixture.detectChanges();

      const calendarDebugElement = dynamicFixture.debugElement.query(
        By.directive(CalendarComponent)
      );
      const disabledClass = 'sbb-calendar-body-disabled';
      calendarElement = calendarDebugElement.nativeElement;
      calendarInstance = calendarDebugElement.componentInstance;

      let cells = Array.from(calendarElement.querySelectorAll('.sbb-calendar-body-cell'));

      expect(cells.slice(0, 9).every(c => c.classList.contains(disabledClass))).toBe(
        true,
        'Expected dates up to the 10th to be disabled.'
      );

      expect(cells.slice(9).every(c => c.classList.contains(disabledClass))).toBe(
        false,
        'Expected dates after the 10th to be enabled.'
      );

      (cells[14] as HTMLElement).click();
      dynamicFixture.detectChanges();
      cells = Array.from(calendarElement.querySelectorAll('.sbb-calendar-body-cell'));

      expect(cells.slice(0, 14).every(c => c.classList.contains(disabledClass))).toBe(
        true,
        'Expected dates up to the 14th to be disabled.'
      );

      expect(cells.slice(14).every(c => c.classList.contains(disabledClass))).toBe(
        false,
        'Expected dates after the 14th to be enabled.'
      );
    });
  });

  describe('calendar with date filter', () => {
    let fixture: ComponentFixture<CalendarWithDateFilterComponent>;
    let testComponent: CalendarWithDateFilterComponent;
    let calendarElement: HTMLElement;
    let calendarInstance: CalendarComponent<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CalendarWithDateFilterComponent);
      fixture.detectChanges();

      const calendarDebugElement = fixture.debugElement.query(By.directive(CalendarComponent));
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
        expect(calendarInstance.currentView).toBe('month');
        expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 1));

        dispatchKeyboardEvent(tableBodyEl, 'keydown', ENTER);
        fixture.detectChanges();

        expect(testComponent.selected).toBeUndefined();
      });
    });
  });
});
