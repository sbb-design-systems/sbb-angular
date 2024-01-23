import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SbbCalendarBody, SbbCalendarCell } from './calendar-body';

@Component({
  template: `
    <table
      sbb-calendar-body
      [label]="label"
      [rows]="rows"
      [todayValue]="todayValue"
      [selectedValue]="selectedValue"
      [labelMinRequiredCells]="labelMinRequiredCells"
      [numCols]="numCols"
      [activeCell]="10"
      [weeksInMonth]="weeksInMonth"
      [isWeekSelectable]="isWeekSelectable"
      (selectedValueChange)="onSelect($event)"
      (selectedWeekChange)="onWeekSelect($event)"
    ></table>
  `,
})
class StandardCalendarBodyComponent {
  label = 'Jan 2017';
  rows = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
  ].map((r) => r.map(createCell));
  todayValue = 3;
  selectedValue = 4;
  labelMinRequiredCells = 3;
  numCols = 7;
  isWeekSelectable = true;
  weeksInMonth: number[] = [];

  onSelect(value: number) {
    this.selectedValue = value;
  }

  onWeekSelect(value: number) {}
}

@Component({
  template: `
    <table
      sbb-calendar-body
      [rows]="rows"
      [allowDisabledSelection]="allowDisabledSelection"
      (selectedValueChange)="selected = $event"
    ></table>
  `,
})
class CalendarBodyWithDisabledCellsComponent {
  rows = [[1, 2, 3, 4]].map((r) =>
    r.map((d) => {
      const cell = createCell(d);
      cell.enabled = d % 2 === 0;
      return cell;
    }),
  );
  allowDisabledSelection = false;
  selected: number;
}

function createCell(value: number) {
  return new SbbCalendarCell(value, `${value}`, `${value}`, true);
}

describe('SbbCalendarBody', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SbbCalendarBody,

        // Test components.
        StandardCalendarBodyComponent,
        CalendarBodyWithDisabledCellsComponent,
      ],
    }).compileComponents();
  }));

  describe('standard calendar body', () => {
    let fixture: ComponentFixture<StandardCalendarBodyComponent>;
    let testComponent: StandardCalendarBodyComponent;
    let calendarBodyNativeElement: Element;
    let rowEls: Element[];
    let labelEls: Element[];
    let cellEls: Element[];

    function refreshElementLists() {
      rowEls = Array.from(calendarBodyNativeElement.querySelectorAll('tr'));
      labelEls = Array.from(calendarBodyNativeElement.querySelectorAll('.sbb-calendar-body-label'));
      cellEls = Array.from(calendarBodyNativeElement.querySelectorAll('.sbb-calendar-body-cell'));
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardCalendarBodyComponent);
      fixture.detectChanges();

      const calendarBodyDebugElement = fixture.debugElement.query(By.directive(SbbCalendarBody));
      calendarBodyNativeElement = calendarBodyDebugElement.nativeElement;
      testComponent = fixture.componentInstance;

      refreshElementLists();
    });

    it('creates body', () => {
      expect(rowEls.length).toBe(2);
      expect(labelEls.length).toBe(0);
      expect(cellEls.length).toBe(14);
    });

    it('highlights today', () => {
      // tslint:disable-next-line:no-non-null-assertion
      const todayCell = calendarBodyNativeElement.querySelector(
        '.sbb-calendar-body-today .sbb-calendar-body-cell-content',
      )!;
      expect(todayCell).not.toBeNull();
      expect(todayCell.innerHTML.trim()).toBe('3');
    });

    it('highlights selected', () => {
      // tslint:disable-next-line:no-non-null-assertion
      const selectedCell = calendarBodyNativeElement.querySelector(
        '.sbb-calendar-body-selected .sbb-calendar-body-cell-content',
      )!;
      expect(selectedCell).not.toBeNull();
      expect(selectedCell.innerHTML.trim()).toBe('4');
    });

    it('should set aria-pressed correctly', () => {
      const pressedCells = cellEls.filter((c) => c.getAttribute('aria-pressed') === 'true');
      const depressedCells = cellEls.filter((c) => c.getAttribute('aria-pressed') === 'false');

      expect(pressedCells.length).withContext('Expected one cell to be marked as pressed.').toBe(1);
      expect(depressedCells.length)
        .withContext('Expected remaining cells to be marked as not pressed.')
        .toBe(cellEls.length - 1);
    });

    it('places label in first row if space is available', () => {
      testComponent.rows[0] = testComponent.rows[0].slice(3);
      testComponent.rows = testComponent.rows.slice();
      fixture.detectChanges();
      refreshElementLists();

      expect(rowEls.length).toBe(2);
      expect(labelEls.length).toBe(1);
      expect(cellEls.length).toBe(11);
      // tslint:disable-next-line:no-non-null-assertion
      expect(rowEls[0].firstElementChild!.classList)
        .withContext('first cell should be the label')
        .toContain('sbb-calendar-body-label');
      expect(labelEls[0].getAttribute('colspan')).toBe('3');
    });

    it('cell should be selected on click', () => {
      const todayElement = calendarBodyNativeElement.querySelector(
        '.sbb-calendar-body-today',
      ) as HTMLElement;
      todayElement.click();
      fixture.detectChanges();

      expect(todayElement.classList)
        .withContext('today should be selected')
        .toContain('sbb-calendar-body-selected');
    });

    it('should mark active date', () => {
      expect((cellEls[10] as HTMLElement).innerText.trim()).toBe('11');
      expect(cellEls[10].classList).toContain('sbb-calendar-body-active');
    });

    it('should toggle week numbers', () => {
      expect(fixture.nativeElement.querySelectorAll('.sbb-calendar-body-week').length).toBe(0);
      fixture.componentInstance.weeksInMonth = [42, 43];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.sbb-calendar-body-week').length).toBe(2);
    });

    it('should emit the clicked week number', () => {
      const spy = spyOn(fixture.componentInstance, 'onWeekSelect');
      fixture.componentInstance.weeksInMonth = [42, 43];
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.sbb-calendar-body-week').click();
      expect(spy).toHaveBeenCalledWith(42);
    });
  });

  describe('calendar body with disabled cells', () => {
    let fixture: ComponentFixture<CalendarBodyWithDisabledCellsComponent>;
    let testComponent: CalendarBodyWithDisabledCellsComponent;
    let calendarBodyNativeElement: Element;
    let cellEls: HTMLElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(CalendarBodyWithDisabledCellsComponent);
      fixture.detectChanges();

      const calendarBodyDebugElement = fixture.debugElement.query(By.directive(SbbCalendarBody));
      calendarBodyNativeElement = calendarBodyDebugElement.nativeElement;
      testComponent = fixture.componentInstance;
      cellEls = Array.from(calendarBodyNativeElement.querySelectorAll('.sbb-calendar-body-cell'));
    });

    it('should only allow selection of disabled cells when allowDisabledSelection is true', () => {
      cellEls[0].click();
      fixture.detectChanges();

      expect(testComponent.selected).toBeFalsy();

      testComponent.allowDisabledSelection = true;
      fixture.detectChanges();

      cellEls[0].click();
      fixture.detectChanges();

      expect(testComponent.selected).toBe(1);
    });
  });
});
