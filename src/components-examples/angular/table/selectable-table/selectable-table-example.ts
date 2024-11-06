import { SelectionModel } from '@angular/cdk/collections';
import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbTableDataSource } from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';

interface VehicleExampleItem {
  position: number;
  name: string;
  category: 'Trainset' | 'Locomotive' | 'Railcar';
  power: number;
  description: string;
}

/**
 * @title Selectable Table
 * @order 70
 */
@Component({
  selector: 'sbb-selectable-table-example',
  templateUrl: 'selectable-table-example.html',
  imports: [SbbTableModule, SbbCheckboxModule, JsonPipe],
})
export class SelectableTableExample {
  columns = [
    { title: 'select' },
    { title: 'position' },
    { title: 'name', subtitle: 'technical' },
    { title: 'power', subtitle: 'horsepower' },
    { title: 'description', subtitle: 'common name' },
    { title: 'category' },
  ];
  dataSource = new SbbTableDataSource<VehicleExampleItem>(VEHICLE_EXAMPLE_DATA.slice(0, 7));
  selection = new SelectionModel<VehicleExampleItem>(true, []);

  get displayedColumns(): string[] {
    return this.columns.map((column) => column.title);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  parentToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: VehicleExampleItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}

const VEHICLE_EXAMPLE_DATA: VehicleExampleItem[] = [
  {
    position: 1,
    category: 'Railcar',
    name: 'Bem 550',
    power: 0,
    description: 'Gleichstromfahrzeug 1500 V',
  },
  {
    position: 2,
    category: 'Trainset',
    name: 'RABDe 510',
    power: 2444,
    description: '«Mirage», «Goldküstenexpress»',
  },
  {
    position: 3,
    category: 'Trainset',
    name: 'RABDe 500',
    power: 5200,
    description: 'InterCity-Neigezug (ICN)',
  },
  {
    position: 4,
    category: 'Trainset',
    name: 'RABe 511',
    power: 4000,
    description: 'KISS, RV-Dosto',
  },
  { position: 5, category: 'Trainset', name: 'RABe 501', power: 6000, description: 'Giruno' },
  {
    position: 6,
    category: 'Trainset',
    name: 'RABDe 502',
    power: 7500,
    description: 'Twindexx IC 200, FV-Dosto',
  },
  { position: 7, category: 'Trainset', name: 'ETR 610', power: 5500, description: 'Astoro' },
  {
    position: 8,
    category: 'Trainset',
    name: 'RABe 514',
    power: 3200,
    description: 'S-Bahn Zürich Doppelstocktriebzug (DTZ)',
  },
  { position: 9, category: 'Trainset', name: 'RABe 520', power: 760, description: 'Seetal GTW' },
  { position: 10, category: 'Trainset', name: 'RABe 526', power: 1100, description: 'GTW' },
  { position: 11, category: 'Trainset', name: 'RABe 521', power: 2000, description: 'Flirt' },
  {
    position: 12,
    category: 'Railcar',
    name: 'RAe 591',
    power: 835,
    description: 'Churchill-Pfeil',
  },
  { position: 13, category: 'Trainset', name: 'TGV PSE', power: 6450, description: 'TGV' },
  { position: 14, category: 'Trainset', name: 'TGV POS', power: 9200, description: 'TGV' },
  { position: 15, category: 'Trainset', name: 'RABe 591', power: 2310, description: 'TEE' },
  { position: 16, category: 'Railcar', name: 'RBe 4/4', power: 1988, description: 'RBe' },
  { position: 17, category: 'Railcar', name: 'RBDe 4/4', power: 1650, description: 'NPZ' },
  { position: 18, category: 'Railcar', name: 'RAe 2/4', power: 404, description: 'Roter Pfeil' },
  { position: 19, category: 'Locomotive', name: 'Re 420', power: 4700, description: 'Re 4/4 II' },
  {
    position: 20,
    category: 'Locomotive',
    name: 'Re 460',
    power: 6100,
    description: 'Locomotive 2000',
  },
];
