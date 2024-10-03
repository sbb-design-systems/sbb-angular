import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FEB, JAN } from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbDatepickerModule } from '../datepicker.module';

import { SbbCalendar } from './calendar';

@Component({
  template: ` <sbb-calendar [startAt]="startDate" [(selected)]="selected"> </sbb-calendar> `,
  standalone: true,
  imports: [SbbDatepickerModule],
})
class StandardCalendarComponent {
  selected: Date;
  startDate = new Date(2017, JAN, 31);
}

describe('SbbCalendarHeader', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule],
    });
  }));

  describe('standard calendar', () => {
    let fixture: ComponentFixture<StandardCalendarComponent>;
    let calendarElement: HTMLElement;
    let prevButton: HTMLElement;
    let nextButton: HTMLElement;
    let calendarInstance: SbbCalendar<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardCalendarComponent);
      fixture.detectChanges();

      const calendarDebugElement = fixture.debugElement.query(By.directive(SbbCalendar));
      calendarElement = calendarDebugElement.nativeElement;
      prevButton = calendarElement.querySelector(
        '.sbb-calendar-controls-button-previous',
      ) as HTMLElement;
      nextButton = calendarElement.querySelector(
        '.sbb-calendar-controls-button-next',
      ) as HTMLElement;

      calendarInstance = calendarDebugElement.componentInstance;
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
