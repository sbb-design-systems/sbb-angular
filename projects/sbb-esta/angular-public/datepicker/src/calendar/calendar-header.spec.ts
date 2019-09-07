import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FEB, JAN } from '@sbb-esta/angular-core/testing';
import { configureTestSuite } from 'ng-bullet';

import { DatepickerModule } from '../datepicker.module';

import { CalendarComponent } from './calendar.component';

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

describe('CalendarHeaderComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [DatepickerModule],
      declarations: [
        // Test components.
        StandardCalendarComponent
      ]
    });
  });

  describe('standard calendar', () => {
    let fixture: ComponentFixture<StandardCalendarComponent>;
    let testComponent: StandardCalendarComponent;
    let calendarElement: HTMLElement;
    let prevButton: HTMLElement;
    let nextButton: HTMLElement;
    let calendarInstance: CalendarComponent<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardCalendarComponent);
      fixture.detectChanges();

      const calendarDebugElement = fixture.debugElement.query(By.directive(CalendarComponent));
      calendarElement = calendarDebugElement.nativeElement;
      prevButton = calendarElement.querySelector(
        '.sbb-calendar-controls-left-arrow'
      ) as HTMLElement;
      nextButton = calendarElement.querySelector(
        '.sbb-calendar-controls-right-arrow'
      ) as HTMLElement;

      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it('should be in month view with specified month active', () => {
      expect(calendarInstance.currentView).toBe('month');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));
    });

    it('should go to next and previous month', () => {
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));

      nextButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2017, FEB, 28));

      prevButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 28));
    });
  });
});
