import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbbSortDirective } from '../sort/sort.component';
import { TableModule } from '../table.module';

import { SbbTableDataSource, TableFilter } from './table-data-source';

@Component({
  template: ` <div sbbSort sbbSortDirection="asc"></div> `,
})
class SbbSortTestComponent {
  @ViewChild(SbbSortDirective, { static: true }) sort: SbbSortDirective;
}

describe('SbbTableDataSource', () => {
  const dataSource = new SbbTableDataSource();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TableModule, NoopAnimationsModule],
      declarations: [SbbSortTestComponent],
    }).compileComponents();
  }));

  describe('sort', () => {
    let fixture: ComponentFixture<SbbSortTestComponent>;
    let sort: SbbSortDirective;

    beforeEach(() => {
      fixture = TestBed.createComponent(SbbSortTestComponent);
      sort = fixture.componentInstance.sort;
      fixture.detectChanges();
    });

    /** Test the data source's `sortData` function. */
    function testSortWithValues(values: any[]) {
      // The data source and SbbSort expect the list to contain objects with values, where
      // the sort should be performed over a particular key.
      // Map the values into an array of objects where where each value is keyed by "prop"
      // e.g. [0, 1, 2] -> [{prop: 0}, {prop: 1}, {prop: 2}]
      const data = values.map((v) => ({ prop: v }));

      // Set the active sort to be on the "prop" key
      sort.active = 'prop';

      const reversedData = data.slice().reverse();
      const sortedData = dataSource.sortData(reversedData, sort);
      expect(sortedData).toEqual(data);
    }

    it('should be able to correctly sort an array of numbers', () => {
      testSortWithValues([-2, -1, 0, 1, 2]);
    });

    it('should be able to correctly sort an array of string', () => {
      testSortWithValues(['apples', 'bananas', 'cherries', 'lemons', 'strawberries']);
    });
  });

  describe('filtering', () => {
    interface Params<T> {
      filter: T;
      expected: boolean;
    }

    interface TestRow {
      colNumber: number;
      colString: string;
      colNull?: null;
      colUndefined?: undefined;
    }

    const testRow: TestRow = {
      colNumber: 1,
      colString: 'Content',
    };

    const testRowAdvanced: TestRow = {
      colNumber: 1,
      colString: 'Content',
      colNull: null,
      colUndefined: undefined,
    };

    it('should filter by string', () => {
      const dataTableSource = new SbbTableDataSource<TestRow>();

      const params: Params<string>[] = [
        { filter: '1', expected: true },
        { filter: ' 1', expected: true },
        { filter: '1 ', expected: true },
        { filter: 'c ', expected: true },
        { filter: 'CONTENT', expected: true },
        { filter: 'z ', expected: false },
        { filter: '', expected: true },
      ];

      params.forEach((param) =>
        expect(dataTableSource.filterPredicate(testRow, param.filter)).toBe(param.expected)
      );
    });

    it('should filter by tableFilter', () => {
      interface TestFilter extends TableFilter {
        colNumber?: number;
        colString?: string;
        colNull?: string;
        colUndefined?: string;
        colNonexistent?: string;
      }
      const dataTableSource = new SbbTableDataSource<TestRow, TestFilter>();

      const params: Params<TestFilter>[] = [
        { filter: {}, expected: true },
        { filter: { _: '', colString: '' }, expected: true },
        { filter: { colString: '', colNumber: undefined }, expected: true },
        { filter: { colNumber: undefined }, expected: true },
        { filter: { _: '' }, expected: true },
        { filter: { colNull: 'search' }, expected: true },
        { filter: { colNull: null } as any, expected: true },
        { filter: { colString: null } as any, expected: true },
        { filter: { colUndefined: 'search' }, expected: true },
        { filter: { colNonexistent: 'search' }, expected: true },
        { filter: { colNumber: 1 }, expected: true },
        { filter: { colString: '  Content  ' }, expected: true },
        { filter: { colString: 'CONTENT' }, expected: true },
        { filter: { colString: 'tent' }, expected: true },
        { filter: { colString: 'tent', colNumber: 1 }, expected: true },
        { filter: { colString: 'tent', colNumber: 2 }, expected: false },
        { filter: { _: 'tent', colNumber: 2 }, expected: false },
        { filter: { _: '', colNumber: 1, colString: 'tent' }, expected: true },
        { filter: { _: 'hello', colNumber: 1, colString: 'tent' }, expected: false },
        { filter: { _: 'tent' }, expected: true },
        { filter: { colNumber: 0 }, expected: false },
        { filter: { colNumber: 1 }, expected: true },
      ];

      params.forEach((param) =>
        expect(dataTableSource.filterPredicate(testRowAdvanced, param.filter)).toBe(param.expected)
      );
    });

    it('should filter by tableFilter with number entry 0', () => {
      interface TestFilter extends TableFilter {
        colNumber?: number;
      }
      const dataTableSource = new SbbTableDataSource<TestRow, TestFilter>();

      const dataRowWith0 = {
        colNumber: 0,
        colString: 'Content',
      };

      const params: Params<TestFilter>[] = [
        { filter: { colNumber: 0 }, expected: true },
        { filter: { colNumber: 1 }, expected: false },
        { filter: { colNumber: -1 }, expected: false },
      ];

      params.forEach((param) =>
        expect(dataTableSource.filterPredicate(dataRowWith0, param.filter)).toBe(param.expected)
      );
    });

    it('should filter by tableFilter with arrays', () => {
      interface TestFilter extends TableFilter {
        colNumber?: number[];
        colString?: string[];
        colNull?: string[];
        colUndefined?: string[];
        colNonexistent?: string[];
      }
      const dataTableSource = new SbbTableDataSource<TestRow, TestFilter>();

      const params: Params<TestFilter>[] = [
        { filter: {}, expected: true },
        { filter: { _: '', colString: [''], colNumber: [] }, expected: true },
        { filter: { colString: [''], colNumber: [] }, expected: true },
        { filter: { colNumber: [] }, expected: true },
        { filter: { colNumber: [] }, expected: true },
        { filter: { _: '' }, expected: true },
        { filter: { colNull: ['search'] }, expected: true },
        { filter: { colUndefined: ['search'] }, expected: true },
        { filter: { colNonexistent: ['search'] }, expected: true },
        { filter: { colNumber: [1] }, expected: true },
        { filter: { colString: ['  Content  '] }, expected: true },
        { filter: { colString: ['CONTENT'] }, expected: true },
        { filter: { colString: ['tent'] }, expected: true },
        { filter: { colString: ['tent'], colNumber: [1] }, expected: true },
        { filter: { colString: ['tent'], colNumber: [2] }, expected: false },
        { filter: { _: ['tent'], colNumber: [2] }, expected: false },
        { filter: { _: [''], colNumber: [1], colString: ['tent'] }, expected: true },
        { filter: { _: ['hello'], colNumber: [1], colString: ['tent'] }, expected: false },
        { filter: { _: ['tent'] }, expected: true },
        { filter: { colNumber: [0] }, expected: false },
        { filter: { colNumber: [0, 2] }, expected: false },
        { filter: { colNumber: [1] }, expected: true },
        { filter: { colNumber: [1, 0] }, expected: true },
        { filter: { colString: ['con', 'TENT'] }, expected: true },
        { filter: { colString: ['', 'TENT'] }, expected: true },
        { filter: { colString: ['', ''] }, expected: true },
        { filter: { colString: ['con', 'search'] }, expected: true },
        { filter: { colString: ['hi', 'search'] }, expected: false },
        { filter: { colString: [] }, expected: true },
      ];

      params.forEach((param) =>
        expect(dataTableSource.filterPredicate(testRowAdvanced, param.filter)).toBe(param.expected)
      );
    });
  });
});
