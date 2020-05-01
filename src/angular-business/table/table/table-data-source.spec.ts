import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbbSortDirective } from '../sort/sort.component';
import { TableModule } from '../table.module';

import { SbbTableDataSource, TableFilter } from './table-data-source';

@Component({
  template: `
    <div sbbSort sbbSortDirection="asc"></div>
  `
})
class SbbSortTestComponent {
  @ViewChild(SbbSortDirective, { static: true }) sort: SbbSortDirective;
}

describe('SbbTableDataSource', () => {
  const dataSource = new SbbTableDataSource();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TableModule, NoopAnimationsModule],
      declarations: [SbbSortTestComponent]
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
      const data = values.map(v => ({ prop: v }));

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
    it('should filter by string', () => {
      interface TestRow {
        colNumber: number;
        colString: string;
      }
      const dataTableSource = new SbbTableDataSource<TestRow>();
      const dataEntry: TestRow = {
        colNumber: 1,
        colString: 'Content'
      };

      interface Params {
        filterString: string;
        expected: boolean;
      }

      const params: Params[] = [
        { filterString: '1', expected: true },
        { filterString: ' 1', expected: true },
        { filterString: '1 ', expected: true },
        { filterString: 'c ', expected: true },
        { filterString: 'CONTENT', expected: true },
        { filterString: 'z ', expected: false },
        { filterString: '', expected: true }
      ];

      params.forEach(param =>
        expect(dataTableSource.filterPredicate(dataEntry, param.filterString)).toBe(param.expected)
      );
    });

    it('should filter by tableFilter', () => {
      interface TestRow {
        colNumber: number;
        colString: string;
        colNull: null;
        colUndefined: undefined;
      }
      interface TestFilter extends TableFilter {
        colNumber?: string | number;
        colString?: string;
        colNull?: string;
        colUndefined?: string;
        colNonexistent?: string;
      }
      const dataTableSource = new SbbTableDataSource<TestRow, TestFilter>();
      const dataEntry: TestRow = {
        colNumber: 1,
        colString: 'Content',
        colNull: null,
        colUndefined: undefined
      };

      interface Params {
        tableFilter: TestFilter;
        expected: boolean;
      }

      const params: Params[] = [
        { tableFilter: {}, expected: true },
        { tableFilter: { _: '', colString: '', colNumber: '' }, expected: true },
        { tableFilter: { colString: '', colNumber: '' }, expected: true },
        { tableFilter: { colNumber: '' }, expected: true },
        { tableFilter: { colNumber: '  ' }, expected: true },
        { tableFilter: { _: '' }, expected: true },
        { tableFilter: { colNull: 'search' }, expected: true },
        { tableFilter: { colUndefined: 'search' }, expected: true },
        { tableFilter: { colNonexistent: 'search' }, expected: true },
        { tableFilter: { colNumber: '  1  ' }, expected: true },
        { tableFilter: { colString: '  Content  ' }, expected: true },
        { tableFilter: { colString: 'CONTENT' }, expected: true },
        { tableFilter: { colString: 'tent' }, expected: true },
        { tableFilter: { colString: 'tent', colNumber: '1' }, expected: true },
        { tableFilter: { colString: 'tent', colNumber: '2' }, expected: false },
        { tableFilter: { _: 'tent', colNumber: '2' }, expected: false },
        { tableFilter: { _: '', colNumber: '1', colString: 'tent' }, expected: true },
        { tableFilter: { _: 'hello', colNumber: '1', colString: 'tent' }, expected: false },
        { tableFilter: { _: 'tent' }, expected: true },
        { tableFilter: { colNumber: 0 }, expected: false },
        { tableFilter: { colNumber: 1 }, expected: true }
      ];

      params.forEach(param =>
        expect(dataTableSource.filterPredicate(dataEntry, param.tableFilter)).toBe(param.expected)
      );
    });
  });
});
