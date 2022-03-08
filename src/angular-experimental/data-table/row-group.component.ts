import { Component, ContentChild, Input } from '@angular/core';

import { SbbDataTableCellDirective } from './cell.directive';

@Component({
  selector: 'sbb-data-table-row-group',
  template: '',
})
export class SbbDataTableRowGroupComponent<T> {
  @Input()
  groupWhen!: (index: number, rowData: T) => boolean;

  @Input()
  id!: string;

  @Input()
  justify?: 'left' | 'right';

  @Input()
  cellClass?: string | ((row: T) => string | undefined);

  @ContentChild(SbbDataTableCellDirective)
  columnCellDirective!: SbbDataTableCellDirective<T>;
}
