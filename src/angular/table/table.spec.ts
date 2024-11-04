import { DataSource } from '@angular/cdk/collections';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbPaginationModule, SbbPaginator } from '@sbb-esta/angular/pagination';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { SbbSort } from './sort/sort';
import { SbbSortHeader } from './sort/sort-header';
import { SbbTableModule } from './table.module';
import { SbbTable } from './table/table';
import { SbbTableDataSource } from './table/table-data-source';
import { SbbTableWrapper } from './table/table-wrapper';

describe('SbbTable', () => {
  const viewPortRulerMockChangeTrigger = new Subject<void>();
  const viewportRulerMock = {
    change: () => viewPortRulerMockChangeTrigger,
  };

  async function waitForLayout(milliseconds = 0): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule],
      providers: [ViewportRuler, { provide: ViewportRuler, useValue: viewportRulerMock }],
    });
  }));

  describe('with basic data source', () => {
    it('should be able to create a table with the right content and without when row', () => {
      const fixture = TestBed.createComponent(SbbTableTestComponent);
      fixture.detectChanges();

      const tableElement = fixture.nativeElement.querySelector('.sbb-table')!;
      const data = fixture.componentInstance.dataSource!.data;
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        [data[0].a, data[0].b, data[0].c],
        [data[1].a, data[1].b, data[1].c],
        [data[2].a, data[2].b, data[2].c],
        ['fourth_row'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });

    it('should create a table with special when row', () => {
      const fixture = TestBed.createComponent(SbbTableWithWhenRowTestComponent);
      fixture.detectChanges();

      const tableElement = fixture.nativeElement.querySelector('.sbb-table');
      expectTableToMatchContent(tableElement, [
        ['Column A'],
        ['a_1'],
        ['a_2'],
        ['a_3'],
        ['fourth_row'],
        ['Footer A'],
      ]);
    });

    it('should create a table with multiTemplateDataRows true', () => {
      const fixture = TestBed.createComponent(SbbTableWithWhenRowTestComponent);
      fixture.componentInstance.multiTemplateDataRows = true;
      fixture.detectChanges();

      const tableElement = fixture.nativeElement.querySelector('.sbb-table');
      expectTableToMatchContent(tableElement, [
        ['Column A'],
        ['a_1'],
        ['a_2'],
        ['a_3'],
        ['a_4'], // With multiple rows, this row shows up along with the special 'when' fourth_row
        ['fourth_row'],
        ['Footer A'],
      ]);
    });
  });

  it('should be able to render a table correctly with native elements', () => {
    const fixture = TestBed.createComponent(NativeHtmlTableTestComponent);
    fixture.detectChanges();

    const tableElement = fixture.nativeElement.querySelector('table');
    const data = fixture.componentInstance.dataSource!.data;
    expectTableToMatchContent(tableElement, [
      ['Column A', 'Column B', 'Column C'],
      [data[0].a, data[0].b, data[0].c],
      [data[1].a, data[1].b, data[1].c],
      [data[2].a, data[2].b, data[2].c],
      [data[3].a, data[3].b, data[3].c],
    ]);
  });

  it('should be able to nest tables', () => {
    const fixture = TestBed.createComponent(NestedHtmlTableTestComponent);
    fixture.detectChanges();
    const outerTable = fixture.nativeElement.querySelector('table');
    const innerTable = outerTable.querySelector('table');
    const outerRows = Array.from<HTMLTableRowElement>(outerTable.querySelector('tbody').rows);
    const innerRows = Array.from<HTMLTableRowElement>(innerTable.querySelector('tbody').rows);

    expect(outerTable).toBeTruthy();
    expect(outerRows.map((row) => row.cells.length)).toEqual([3, 3, 3, 3]);

    expect(innerTable).toBeTruthy();
    expect(innerRows.map((row) => row.cells.length)).toEqual([3, 3, 3, 3]);
  });

  it('should render with SbbTableDataSource and sort', () => {
    const fixture = TestBed.createComponent(SbbTableWithSortTestComponent);
    fixture.detectChanges();

    const tableElement = fixture.nativeElement.querySelector('.sbb-table')!;
    const data = fixture.componentInstance.dataSource!.data;
    expectTableToMatchContent(tableElement, [
      ['Column A', 'Column B', 'Column C'],
      [data[0].a, data[0].b, data[0].c],
      [data[1].a, data[1].b, data[1].c],
      [data[2].a, data[2].b, data[2].c],
    ]);
  });

  it('should render with SbbTableDataSource and pagination', () => {
    const fixture = TestBed.createComponent(SbbTableWithPaginatorTestComponent);
    fixture.detectChanges();

    const tableElement = fixture.nativeElement.querySelector('.sbb-table')!;
    const data = fixture.componentInstance.dataSource!.data;
    expectTableToMatchContent(tableElement, [
      ['Column A', 'Column B', 'Column C'],
      [data[0].a, data[0].b, data[0].c],
      [data[1].a, data[1].b, data[1].c],
      [data[2].a, data[2].b, data[2].c],
    ]);
  });

  it('should apply custom sticky CSS class to sticky cells', fakeAsync(() => {
    const fixture = TestBed.createComponent(StickyTableTestComponent);
    fixture.detectChanges();
    flushMicrotasks();

    const stuckCellElement = fixture.nativeElement.querySelector('.sbb-table th')!;
    expect(stuckCellElement.classList).toContain('sbb-table-sticky');
  }));

  // Note: needs to be fakeAsync so it catches the error.
  it('should not throw when a row definition is on an ng-container', fakeAsync(() => {
    const fixture = TestBed.createComponent(TableWithNgContainerRowTestComponent);

    expect(() => {
      fixture.detectChanges();
      tick();
    }).not.toThrow();
  }));

  describe('with SbbTableDataSource and sort/pagination/filter', () => {
    let tableElement: HTMLElement;
    let fixture: ComponentFixture<ArrayDataSourceSbbTableTestComponent>;
    let dataSource: SbbTableDataSource<TestData>;
    let component: ArrayDataSourceSbbTableTestComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ArrayDataSourceSbbTableTestComponent);
      fixture.detectChanges();

      tableElement = fixture.nativeElement.querySelector('.sbb-table');
      component = fixture.componentInstance;
      dataSource = fixture.componentInstance.dataSource;
    });

    it('should create table and display data source contents', () => {
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });

    it('changing data should update the table contents', () => {
      // Add data
      component.underlyingDataSource.addData();
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['a_4', 'b_4', 'c_4'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Remove data
      const modifiedData = dataSource.data.slice();
      modifiedData.shift();
      dataSource.data = modifiedData;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['a_4', 'b_4', 'c_4'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });

    it('should update the page index when switching to a smaller data set from a page', fakeAsync(() => {
      // Add 20 rows so we can switch pages.
      for (let i = 0; i < 20; i++) {
        component.underlyingDataSource.addData();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }

      // Go to the last page.
      fixture.componentInstance.paginator.lastPage();
      fixture.detectChanges();

      // Switch to a smaller data set.
      dataSource.data = [{ a: 'a_0', b: 'b_0', c: 'c_0' }];
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_0', 'b_0', 'c_0'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    }));

    it('should be able to filter the table contents', fakeAsync(() => {
      // Change filter to a_1, should match one row
      dataSource.filter = 'a_1';
      flushMicrotasks(); // Resolve promise that updates paginator's length
      fixture.detectChanges();
      expect(dataSource.filteredData.length).toBe(1);
      expect(dataSource.filteredData[0]).toBe(dataSource.data[0]);
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      flushMicrotasks(); // Resolve promise that updates paginator's length
      expect(dataSource.paginator!.length).toBe(1);

      // Change filter to '  A_2  ', should match one row (ignores case and whitespace)
      dataSource.filter = '  A_2  ';
      flushMicrotasks();
      fixture.detectChanges();
      expect(dataSource.filteredData.length).toBe(1);
      expect(dataSource.filteredData[0]).toBe(dataSource.data[1]);
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_2', 'b_2', 'c_2'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Change filter to empty string, should match all rows
      dataSource.filter = '';
      flushMicrotasks();
      fixture.detectChanges();
      expect(dataSource.filteredData.length).toBe(3);
      expect(dataSource.filteredData[0]).toBe(dataSource.data[0]);
      expect(dataSource.filteredData[1]).toBe(dataSource.data[1]);
      expect(dataSource.filteredData[2]).toBe(dataSource.data[2]);
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Change filter function and filter, should match to rows with zebra.
      dataSource.filterPredicate = (data, filter) => {
        let dataStr;
        switch (data.a) {
          case 'a_1':
            dataStr = 'elephant';
            break;
          case 'a_2':
            dataStr = 'zebra';
            break;
          case 'a_3':
            dataStr = 'monkey';
            break;
          default:
            dataStr = '';
        }

        return dataStr.indexOf(filter) !== -1;
      };
      dataSource.filter = 'zebra';
      flushMicrotasks();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_2', 'b_2', 'c_2'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Change the filter to a falsy value that might come in from the view.
      dataSource.filter = 0 as any;
      flushMicrotasks();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    }));

    it('should not match concatenated words', fakeAsync(() => {
      // Set the value to the last character of the first
      // column plus the first character of the second column.
      dataSource.filter = '1b';
      flushMicrotasks();
      fixture.detectChanges();
      expect(dataSource.filteredData.length).toBe(0);
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    }));

    it('should be able to sort the table contents', () => {
      // Activate column A sort
      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Activate column A sort again (reverse direction)
      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_3', 'b_3', 'c_3'],
        ['a_2', 'b_2', 'c_2'],
        ['a_1', 'b_1', 'c_1'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Change sort function to customize how it sorts - first column 1, then 3, then 2
      dataSource.sortingDataAccessor = (data) => {
        switch (data.a) {
          case 'a_1':
            return 'elephant';
          case 'a_2':
            return 'zebra';
          case 'a_3':
            return 'monkey';
          default:
            return '';
        }
      };
      component.sort.direction = '';
      component.sort.sort(component.sortHeader);
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_3', 'b_3', 'c_3'],
        ['a_2', 'b_2', 'c_2'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });

    it('should by default correctly sort an empty string', () => {
      // Activate column A sort
      dataSource.data[0].a = ' ';
      component.sort.sort(component.sortHeader);
      fixture.detectChanges();

      // Expect that empty string row comes before the other values
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Expect that empty string row comes before the other values
      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_3', 'b_3', 'c_3'],
        ['a_2', 'b_2', 'c_2'],
        ['', 'b_1', 'c_1'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });

    it('should by default correctly sort undefined values', () => {
      // Activate column A sort
      dataSource.data[0].a = undefined;

      // Expect that undefined row comes before the other values
      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Expect that undefined row comes after the other values
      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_3', 'b_3', 'c_3'],
        ['a_2', 'b_2', 'c_2'],
        ['', 'b_1', 'c_1'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });

    it('should sort zero correctly', () => {
      // Activate column A sort
      dataSource.data[0].a = 1;
      dataSource.data[1].a = 0;
      dataSource.data[2].a = -1;

      // Expect that zero comes after the negative numbers and before the positive ones.
      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['-1', 'b_3', 'c_3'],
        ['0', 'b_2', 'c_2'],
        ['1', 'b_1', 'c_1'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Expect that zero comes after the negative numbers and before
      // the positive ones when switching the sorting direction.
      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['1', 'b_1', 'c_1'],
        ['0', 'b_2', 'c_2'],
        ['-1', 'b_3', 'c_3'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });

    it('should be able to page the table contents', fakeAsync(() => {
      // Add 100 rows, should only display first 5 since page length is 5
      for (let i = 0; i < 100; i++) {
        component.underlyingDataSource.addData();
      }
      fixture.detectChanges();
      flushMicrotasks(); // Resolve promise that updates paginator's length
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['a_4', 'b_4', 'c_4'],
        ['a_5', 'b_5', 'c_5'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      // Navigate to the next page
      component.paginator.nextPage();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_6', 'b_6', 'c_6'],
        ['a_7', 'b_7', 'c_7'],
        ['a_8', 'b_8', 'c_8'],
        ['a_9', 'b_9', 'c_9'],
        ['a_10', 'b_10', 'c_10'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    }));

    it('should sort strings with numbers larger than MAX_SAFE_INTEGER correctly', () => {
      const large = '9563256840123535';
      const larger = '9563256840123536';
      const largest = '9563256840123537';

      dataSource.data[0].a = largest;
      dataSource.data[1].a = larger;
      dataSource.data[2].a = large;

      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        [large, 'b_3', 'c_3'],
        [larger, 'b_2', 'c_2'],
        [largest, 'b_1', 'c_1'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      component.sort.sort(component.sortHeader);
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        [largest, 'b_1', 'c_1'],
        [larger, 'b_2', 'c_2'],
        [large, 'b_3', 'c_3'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });

    it('should fall back to empty table if invalid data is passed in', () => {
      component.underlyingDataSource.addData();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['a_4', 'b_4', 'c_4'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      dataSource.data = null!;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      component.underlyingDataSource.addData();
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['a_4', 'b_4', 'c_4'],
        ['a_5', 'b_5', 'c_5'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);

      dataSource.data = {} as any;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });
  });

  it('should set css classes to grouped columns', () => {
    const fixture = TestBed.createComponent(TableWithColumnGroupingTestComponent);
    fixture.detectChanges();

    const allHtml = fixture.debugElement.nativeElement;

    expect(allHtml.querySelector('th.sbb-column-column_a.sbb-table-group-with-next')).toBeTruthy();
    expect(allHtml.querySelector('th.sbb-column-column_b.sbb-table-group-with-next')).toBeTruthy();
    expect(
      allHtml.querySelectorAll('td.sbb-column-column_a.sbb-table-group-with-next').length,
    ).toBe(4);
    expect(
      allHtml.querySelectorAll('td.sbb-column-column_b.sbb-table-group-with-next').length,
    ).toBe(4);
  });

  it('should set shadow to sticky columns when scrolling', fakeAsync(() => {
    const fixture = TestBed.createComponent(TableWithWrapperAndStickyColumnsTestComponent);
    fixture.detectChanges();
    flushMicrotasks(); // Set css sticky classes
    const tableWrapper = fixture.debugElement.query(By.directive(SbbTableWrapper));
    const allHtml = fixture.debugElement.nativeElement;

    // Then sticky left and right classes should be applied
    expect(
      allHtml.querySelector(
        '.sbb-column-column_a.sbb-table-sticky.sbb-table-sticky-border-elem-left',
      ),
    ).toBeTruthy();
    expect(
      allHtml.querySelector(
        '.sbb-column-column_c.sbb-table-sticky.sbb-table-sticky-border-elem-right',
      ),
    ).toBeTruthy();

    // Then it should have offset right
    expect(
      tableWrapper.nativeElement.classList.contains('sbb-table-wrapper-offset-right'),
    ).toBeTrue();
    expect(tableWrapper.nativeElement.classList.length).toBe(3); // Ensure old state classes were removed

    // When scrolling to a middle position
    tableWrapper.nativeElement.scrollLeft = 1;
    fixture.changeDetectorRef.markForCheck();
    tableWrapper.nativeElement.dispatchEvent(new CustomEvent('scroll'));

    // Then it should have offset right and left
    expect(
      tableWrapper.nativeElement.classList.contains('sbb-table-wrapper-offset-both'),
    ).toBeTrue();
    expect(tableWrapper.nativeElement.classList.length).toBe(3); // Ensure old state classes were removed

    // When scrolling to the right position
    tableWrapper.nativeElement.scrollLeft =
      tableWrapper.nativeElement.scrollWidth - tableWrapper.nativeElement.offsetWidth;
    tableWrapper.nativeElement.dispatchEvent(new CustomEvent('scroll'));

    // Then it should have offset left
    expect(
      tableWrapper.nativeElement.classList.contains('sbb-table-wrapper-offset-left'),
    ).toBeTrue();
    expect(tableWrapper.nativeElement.classList.length).toBe(3); // Ensure old state classes were removed

    // When maximizing scroll area
    fixture.componentInstance.wrapperWidth = 400;
    fixture.detectChanges();
    viewPortRulerMockChangeTrigger.next(); // Manually trigger resize observable

    // Then it should have offset 'none'
    expect(
      tableWrapper.nativeElement.classList.contains('sbb-table-wrapper-offset-none'),
    ).toBeTrue();
    expect(tableWrapper.nativeElement.classList.length).toBe(3); // Ensure old state classes were removed
  }));

  it('should update sticky left offset on data change (initially here)', fakeAsync(() => {
    const fixture = TestBed.createComponent(TableWithTwoStickyColumnsTestComponent);
    fixture.detectChanges();
    fixture.detectChanges(); // Second change detection needed
    tick();

    const columnAComputedStyles = getComputedStyle(
      fixture.nativeElement.querySelector('.sbb-column-column_a'),
    );
    const columnBLeftOffset =
      fixture.debugElement.nativeElement.querySelector('.sbb-column-column_b')!.style.left;

    expect(parseInt(columnBLeftOffset, 10)).toBeCloseTo(parseInt(columnAComputedStyles.width, 10));
  }));

  it('should update sticky left offset on viewport change', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TableWithTwoStickyColumnsTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const tableElement = fixture.nativeElement.querySelector('.sbb-table');

    // Then left offset should be updated
    let columnAComputedStyles = getComputedStyle(
      fixture.nativeElement.querySelector('.sbb-column-column_a'),
    );
    let columnBLeftOffset =
      fixture.debugElement.nativeElement.querySelector('.sbb-column-column_b')!.style.left;
    expect(parseInt(columnBLeftOffset, 10)).toBeCloseTo(parseInt(columnAComputedStyles.width, 10));

    // When changing size of table
    tableElement.style.width = '200px';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await waitForLayout(150); // wait for viewportRulerChange

    viewPortRulerMockChangeTrigger.next(); // Manually trigger viewportRulerChange
    await waitForLayout(150); // wait for viewportRulerChange

    // Then the left offset should be updated
    columnAComputedStyles = getComputedStyle(
      fixture.nativeElement.querySelector('.sbb-column-column_a'),
    );
    columnBLeftOffset =
      fixture.debugElement.nativeElement.querySelector('.sbb-column-column_b')!.style.left;
    expect(parseInt(columnBLeftOffset, 10)).toBeCloseTo(parseInt(columnAComputedStyles.width, 10));
  }));

  describe('wrapped by SbbTableWrapper', () => {
    it('should be focusable', fakeAsync(() => {
      const fixture = TestBed.createComponent(TableWithWrapper);
      fixture.detectChanges();

      const tableWrapper = fixture.debugElement.query(By.directive(SbbTableWrapper));

      expect(tableWrapper.attributes['tabindex']).toBe('0');
    }));

    it('should be configurable to be not focusable', fakeAsync(() => {
      const fixture = TestBed.createComponent(TableWithWrapper);
      fixture.componentInstance.focusable = false;
      fixture.detectChanges();

      const tableWrapper = fixture.debugElement.query(By.directive(SbbTableWrapper));

      expect(tableWrapper.attributes['tabindex']).toBeUndefined();
    }));
  });
});

interface TestData {
  a: string | number | undefined;
  b: string | number | undefined;
  c: string | number | undefined;
}

class FakeDataSource extends DataSource<TestData> {
  _dataChange = new BehaviorSubject<TestData[]>([]);
  get data() {
    return this._dataChange.getValue();
  }
  set data(data: TestData[]) {
    this._dataChange.next(data);
  }

  constructor() {
    super();
    for (let i = 0; i < 4; i++) {
      this.addData();
    }
  }

  connect(): Observable<TestData[]> {
    return this._dataChange;
  }

  disconnect() {}

  addData() {
    const nextIndex = this.data.length + 1;

    const copiedData = this.data.slice();
    copiedData.push({
      a: `a_${nextIndex}`,
      b: `b_${nextIndex}`,
      c: `c_${nextIndex}`,
    });

    this.data = copiedData;
  }
}

@Component({
  template: `
    <sbb-table [dataSource]="dataSource">
      <ng-container sbbColumnDef="column_a">
        <sbb-header-cell *sbbHeaderCellDef> Column A</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.a }}</sbb-cell>
        <sbb-footer-cell *sbbFooterCellDef> Footer A</sbb-footer-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_b">
        <sbb-header-cell *sbbHeaderCellDef> Column B</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.b }}</sbb-cell>
        <sbb-footer-cell *sbbFooterCellDef> Footer B</sbb-footer-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_c">
        <sbb-header-cell *sbbHeaderCellDef> Column C</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.c }}</sbb-cell>
        <sbb-footer-cell *sbbFooterCellDef> Footer C</sbb-footer-cell>
      </ng-container>

      <ng-container sbbColumnDef="special_column">
        <sbb-cell *sbbCellDef="let row"> fourth_row </sbb-cell>
      </ng-container>

      <sbb-header-row *sbbHeaderRowDef="columnsToRender"></sbb-header-row>
      <sbb-row *sbbRowDef="let row; columns: columnsToRender"></sbb-row>
      <sbb-row *sbbRowDef="let row; columns: ['special_column']; when: isFourthRow"></sbb-row>
      <sbb-footer-row *sbbFooterRowDef="columnsToRender"></sbb-footer-row>
    </sbb-table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbTableTestComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
  isFourthRow = (i: number, _rowData: TestData) => i === 3;

  @ViewChild(SbbTable) table: SbbTable<TestData>;
}

@Component({
  template: `
    <table sbb-table [dataSource]="dataSource">
      <ng-container sbbColumnDef="column_a">
        <th sbb-header-cell *sbbHeaderCellDef>Column A</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.a }}</td>
      </ng-container>

      <ng-container sbbColumnDef="column_b">
        <th sbb-header-cell *sbbHeaderCellDef>Column B</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.b }}</td>
      </ng-container>

      <ng-container sbbColumnDef="column_c">
        <th sbb-header-cell *sbbHeaderCellDef>Column C</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.c }}</td>
      </ng-container>

      <tr sbb-header-row *sbbHeaderRowDef="columnsToRender"></tr>
      <tr sbb-row *sbbRowDef="let row; columns: columnsToRender"></tr>
    </table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class NativeHtmlTableTestComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];

  @ViewChild(SbbTable) table: SbbTable<TestData>;
}

@Component({
  template: `
    <table sbb-table [dataSource]="dataSource">
      <ng-container sbbColumnDef="column_a">
        <th sbb-header-cell *sbbHeaderCellDef>Column A</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.a }}</td>
      </ng-container>

      <ng-container sbbColumnDef="column_b">
        <th sbb-header-cell *sbbHeaderCellDef>Column B</th>
        <td sbb-cell *sbbCellDef="let row">
          <table sbb-table [dataSource]="dataSource">
            <ng-container sbbColumnDef="column_a">
              <th sbb-header-cell *sbbHeaderCellDef>Column A</th>
              <td sbb-cell *sbbCellDef="let row">{{ row.a }}</td>
            </ng-container>

            <ng-container sbbColumnDef="column_b">
              <th sbb-header-cell *sbbHeaderCellDef>Column B</th>
              <td sbb-cell *sbbCellDef="let row">{{ row.b }}</td>
            </ng-container>

            <ng-container sbbColumnDef="column_c">
              <th sbb-header-cell *sbbHeaderCellDef>Column C</th>
              <td sbb-cell *sbbCellDef="let row">{{ row.c }}</td>
            </ng-container>

            <tr sbb-header-row *sbbHeaderRowDef="columnsToRender"></tr>
            <tr sbb-row *sbbRowDef="let row; columns: columnsToRender"></tr>
          </table>
        </td>
      </ng-container>

      <ng-container sbbColumnDef="column_c">
        <th sbb-header-cell *sbbHeaderCellDef>Column C</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.c }}</td>
      </ng-container>

      <tr sbb-header-row *sbbHeaderRowDef="columnsToRender"></tr>
      <tr sbb-row *sbbRowDef="let row; columns: columnsToRender"></tr>
    </table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class NestedHtmlTableTestComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
}

@Component({
  template: `
    <table sbb-table [dataSource]="dataSource">
      <ng-container sbbColumnDef="column_a">
        <th sbb-header-cell *sbbHeaderCellDef>Column A</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.a }}</td>
      </ng-container>

      <tr sbb-header-row *sbbHeaderRowDef="columnsToRender; sticky: true"></tr>
      <tr sbb-row *sbbRowDef="let row; columns: columnsToRender"></tr>
    </table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class StickyTableTestComponent {
  dataSource = new FakeDataSource();
  columnsToRender = ['column_a'];

  @ViewChild(SbbTable) table: SbbTable<TestData>;
}

@Component({
  template: `
    <sbb-table [dataSource]="dataSource" [multiTemplateDataRows]="multiTemplateDataRows">
      <ng-container sbbColumnDef="column_a">
        <sbb-header-cell *sbbHeaderCellDef> Column A</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.a }}</sbb-cell>
        <sbb-footer-cell *sbbFooterCellDef> Footer A</sbb-footer-cell>
      </ng-container>

      <ng-container sbbColumnDef="special_column">
        <sbb-cell *sbbCellDef="let row"> fourth_row</sbb-cell>
      </ng-container>

      <sbb-header-row *sbbHeaderRowDef="['column_a']"></sbb-header-row>
      <sbb-row *sbbRowDef="let row; columns: ['column_a']"></sbb-row>
      <sbb-row *sbbRowDef="let row; columns: ['special_column']; when: isFourthRow"></sbb-row>
      <sbb-footer-row *sbbFooterRowDef="['column_a']"></sbb-footer-row>
    </sbb-table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbTableWithWhenRowTestComponent {
  multiTemplateDataRows: boolean = false;
  dataSource: FakeDataSource | null = new FakeDataSource();
  isFourthRow = (i: number, _rowData: TestData) => i === 3;

  @ViewChild(SbbTable) table: SbbTable<TestData>;
}

@Component({
  template: `
    <sbb-table [dataSource]="dataSource" sbbSort>
      <ng-container sbbColumnDef="column_a">
        <sbb-header-cell *sbbHeaderCellDef sbb-sort-header="a"> Column A</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.a }}</sbb-cell>
        <sbb-footer-cell *sbbFooterCellDef> Footer A</sbb-footer-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_b">
        <sbb-header-cell *sbbHeaderCellDef> Column B</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.b }}</sbb-cell>
        <sbb-footer-cell *sbbFooterCellDef> Footer B</sbb-footer-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_c">
        <sbb-header-cell *sbbHeaderCellDef> Column C</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.c }}</sbb-cell>
        <sbb-footer-cell *sbbFooterCellDef> Footer C</sbb-footer-cell>
      </ng-container>

      <sbb-header-row *sbbHeaderRowDef="columnsToRender"></sbb-header-row>
      <sbb-row *sbbRowDef="let row; columns: columnsToRender"></sbb-row>
      <sbb-footer-row *sbbFooterRowDef="columnsToRender"></sbb-footer-row>
    </sbb-table>

    <sbb-paginator [pageSize]="5"></sbb-paginator>
  `,
  standalone: true,
  imports: [SbbTableModule, SbbPaginationModule],
})
class ArrayDataSourceSbbTableTestComponent implements AfterViewInit {
  underlyingDataSource = new FakeDataSource();
  dataSource = new SbbTableDataSource<TestData>();
  columnsToRender = ['column_a', 'column_b', 'column_c'];

  @ViewChild(SbbTable) table: SbbTable<TestData>;
  @ViewChild(SbbPaginator) paginator: SbbPaginator;
  @ViewChild(SbbSort) sort: SbbSort;
  @ViewChild(SbbSortHeader) sortHeader: SbbSortHeader;

  constructor() {
    this.underlyingDataSource.data = [];

    // Add three rows of data
    this.underlyingDataSource.addData();
    this.underlyingDataSource.addData();
    this.underlyingDataSource.addData();

    this.underlyingDataSource.connect().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}

@Component({
  template: `
    <sbb-table [dataSource]="dataSource" sbbSort>
      <ng-container sbbColumnDef="column_a">
        <sbb-header-cell *sbbHeaderCellDef sbb-sort-header="a"> Column A</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.a }}</sbb-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_b">
        <sbb-header-cell *sbbHeaderCellDef> Column B</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.b }}</sbb-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_c">
        <sbb-header-cell *sbbHeaderCellDef> Column C</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.c }}</sbb-cell>
      </ng-container>

      <sbb-header-row *sbbHeaderRowDef="columnsToRender"></sbb-header-row>
      <sbb-row *sbbRowDef="let row; columns: columnsToRender"></sbb-row>
    </sbb-table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbTableWithSortTestComponent implements OnInit {
  underlyingDataSource = new FakeDataSource();
  dataSource = new SbbTableDataSource<TestData>();
  columnsToRender = ['column_a', 'column_b', 'column_c'];

  @ViewChild(SbbTable) table: SbbTable<TestData>;
  @ViewChild(SbbSort) sort: SbbSort;

  constructor() {
    this.underlyingDataSource.data = [];

    // Add three rows of data
    this.underlyingDataSource.addData();
    this.underlyingDataSource.addData();
    this.underlyingDataSource.addData();

    this.underlyingDataSource.connect().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this.dataSource!.sort = this.sort;
  }
}

@Component({
  template: `
    <sbb-table [dataSource]="dataSource">
      <ng-container sbbColumnDef="column_a">
        <sbb-header-cell *sbbHeaderCellDef> Column A</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.a }}</sbb-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_b">
        <sbb-header-cell *sbbHeaderCellDef> Column B</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.b }}</sbb-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_c">
        <sbb-header-cell *sbbHeaderCellDef> Column C</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.c }}</sbb-cell>
      </ng-container>

      <sbb-header-row *sbbHeaderRowDef="columnsToRender"></sbb-header-row>
      <sbb-row *sbbRowDef="let row; columns: columnsToRender"></sbb-row>
    </sbb-table>

    <sbb-paginator [pageSize]="5"></sbb-paginator>
  `,
  standalone: true,
  imports: [SbbTableModule, SbbPaginationModule],
})
class SbbTableWithPaginatorTestComponent implements OnInit {
  underlyingDataSource = new FakeDataSource();
  dataSource = new SbbTableDataSource<TestData>();
  columnsToRender = ['column_a', 'column_b', 'column_c'];

  @ViewChild(SbbTable) table: SbbTable<TestData>;
  @ViewChild(SbbPaginator) paginator: SbbPaginator;

  constructor() {
    this.underlyingDataSource.data = [];

    // Add three rows of data
    this.underlyingDataSource.addData();
    this.underlyingDataSource.addData();
    this.underlyingDataSource.addData();

    this.underlyingDataSource.connect().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this.dataSource!.paginator = this.paginator;
  }
}

@Component({
  template: `
    <sbb-table [dataSource]="dataSource">
      <ng-container sbbColumnDef="column_a">
        <sbb-header-cell *sbbHeaderCellDef>Column A</sbb-header-cell>
        <sbb-cell *sbbCellDef="let row">{{ row.a }}</sbb-cell>
      </ng-container>

      <sbb-header-row *sbbHeaderRowDef="columnsToRender"></sbb-header-row>
      <ng-container *sbbRowDef="let row; columns: columnsToRender">
        <sbb-row></sbb-row>
      </ng-container>
    </sbb-table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class TableWithNgContainerRowTestComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a'];
}

@Component({
  template: `
    <table sbb-table [dataSource]="dataSource">
      <ng-container sbbColumnDef="column_a" groupWithNext>
        <th sbb-header-cell *sbbHeaderCellDef>Column A</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.a }}</td>
      </ng-container>

      <sbb-text-column name="column_b" groupWithNext></sbb-text-column>

      <tr sbb-header-row *sbbHeaderRowDef="columnsToRender"></tr>
      <tr sbb-row *sbbRowDef="let row; columns: columnsToRender"></tr>
    </table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class TableWithColumnGroupingTestComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b'];
}

@Component({
  template: `
    <sbb-table-wrapper [focusable]="focusable">
      <table>
        <tr>
          <td>Content</td>
        </tr>
      </table>
    </sbb-table-wrapper>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class TableWithWrapper {
  focusable: boolean = true;
}

@Component({
  template: `
    <sbb-table-wrapper [style.width]="wrapperWidth + 'px'">
      <table sbb-table [dataSource]="dataSource">
        <ng-container sbbColumnDef="column_a" sticky>
          <th sbb-header-cell *sbbHeaderCellDef>Column A with a very wide width</th>
          <td sbb-cell *sbbCellDef="let row">{{ row.a }}</td>
        </ng-container>

        <sbb-text-column name="column_b"></sbb-text-column>

        <ng-container sbbColumnDef="column_c" stickyEnd>
          <th sbb-header-cell *sbbHeaderCellDef>Column C</th>
          <td sbb-cell *sbbCellDef="let row">{{ row.c }}</td>
        </ng-container>

        <tr sbb-header-row *sbbHeaderRowDef="columnsToRender"></tr>
        <tr sbb-row *sbbRowDef="let row; columns: columnsToRender"></tr>
      </table>
    </sbb-table-wrapper>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class TableWithWrapperAndStickyColumnsTestComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
  wrapperWidth: number = 200;
}

@Component({
  template: `
    <table sbb-table [dataSource]="dataSource">
      <ng-container sbbColumnDef="column_a" sticky>
        <th sbb-header-cell *sbbHeaderCellDef>Column A</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.a }} and a lot more content</td>
      </ng-container>
      <ng-container sbbColumnDef="column_b" sticky>
        <th sbb-header-cell *sbbHeaderCellDef>Column B</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.b }}</td>
      </ng-container>
      <ng-container sbbColumnDef="column_c">
        <th sbb-header-cell *sbbHeaderCellDef>Column C</th>
        <td sbb-cell *sbbCellDef="let row">{{ row.c }}</td>
      </ng-container>

      <tr sbb-header-row *sbbHeaderRowDef="columnsToRender"></tr>
      <tr sbb-row *sbbRowDef="let row; columns: columnsToRender"></tr>
    </table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class TableWithTwoStickyColumnsTestComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
}

function getElements(element: Element, query: string): Element[] {
  return [].slice.call(element.querySelectorAll(query));
}

function getHeaderRows(tableElement: Element): Element[] {
  return [].slice.call(tableElement.querySelectorAll('.sbb-header-row'))!;
}

function getFooterRows(tableElement: Element): Element[] {
  return [].slice.call(tableElement.querySelectorAll('.sbb-footer-row'))!;
}

function getRows(tableElement: Element): Element[] {
  return getElements(tableElement, '.sbb-row');
}

function getCells(row: Element): Element[] {
  if (!row) {
    return [];
  }

  let cells = getElements(row, 'sbb-cell');
  if (!cells.length) {
    cells = getElements(row, 'td');
  }

  return cells;
}

function getHeaderCells(headerRow: Element): Element[] {
  let cells = getElements(headerRow, 'sbb-header-cell');
  if (!cells.length) {
    cells = getElements(headerRow, 'th');
  }

  return cells;
}

function getFooterCells(footerRow: Element): Element[] {
  let cells = getElements(footerRow, 'sbb-footer-cell');
  if (!cells.length) {
    cells = getElements(footerRow, 'td');
  }

  return cells;
}

function getActualTableContent(tableElement: Element): string[][] {
  let actualTableContent: Element[][] = [];
  getHeaderRows(tableElement).forEach((row) => {
    actualTableContent.push(getHeaderCells(row));
  });

  // Check data row cells
  const rows = getRows(tableElement).map((row) => getCells(row));
  actualTableContent = actualTableContent.concat(rows);

  getFooterRows(tableElement).forEach((row) => {
    actualTableContent.push(getFooterCells(row));
  });

  // Convert the nodes into their text content;
  return actualTableContent.map((row) => row.map((cell) => cell.textContent!.trim()));
}

export function expectTableToMatchContent(tableElement: Element, expected: any[]) {
  const missedExpectations: string[] = [];
  function checkCellContent(actualCell: string, expectedCell: string) {
    if (actualCell !== expectedCell) {
      missedExpectations.push(`Expected cell contents to be ${expectedCell} but was ${actualCell}`);
    }
  }

  const actual = getActualTableContent(tableElement);

  // Make sure the number of rows match
  if (actual.length !== expected.length) {
    missedExpectations.push(`Expected ${expected.length} total rows but got ${actual.length}`);
    fail(missedExpectations.join('\n'));
  }

  actual.forEach((row, rowIndex) => {
    const expectedRow = expected[rowIndex];

    // Make sure the number of cells match
    if (row.length !== expectedRow.length) {
      missedExpectations.push(`Expected ${expectedRow.length} cells in row but got ${row.length}`);
      fail(missedExpectations.join('\n'));
    }

    row.forEach((actualCell, cellIndex) => {
      const expectedCell = expectedRow ? expectedRow[cellIndex] : null;
      checkCellContent(actualCell, expectedCell);
    });
  });

  if (missedExpectations.length) {
    fail(missedExpectations.join('\n'));
  }
}
