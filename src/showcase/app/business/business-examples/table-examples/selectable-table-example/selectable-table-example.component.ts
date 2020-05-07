import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { VehicleExampleItem, VEHICLE_EXAMPLE_DATA } from '../table-example-data';

@Component({
  selector: 'sbb-table-selection-example',
  templateUrl: './selectable-table-example.component.html'
})
export class SelectableTableExampleComponent {
  displayedColumns: string[] = ['select', 'position', 'name', 'power', 'description', 'category'];
  dataSource = new SbbTableDataSource<VehicleExampleItem>(VEHICLE_EXAMPLE_DATA.slice(0, 7));
  selection = new SelectionModel<VehicleExampleItem>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: VehicleExampleItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
