import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SbbPaginator } from '@sbb-esta/angular/pagination';
import { SbbTable, SbbTableDataSource, SbbTableFilter } from '@sbb-esta/angular/table';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface VehicleExampleItem {
  position: number;
  name: string;
  category: 'Trainset' | 'Locomotive' | 'Railcar';
  power: number;
  description: string;
}

interface VehicleFilter extends SbbTableFilter {
  category?: string[] | null;
  name?: string | null;
  description?: string | null;
}

/**
 * @title Table with filtering and selection
 * @order 130
 */
@Component({
  selector: 'sbb-filter-select-table-example',
  templateUrl: 'filter-select-table-example.html',
})
export class FilterSelectTableExample implements AfterViewInit, OnDestroy {
  @ViewChild(SbbPaginator) paginator: SbbPaginator;
  @ViewChild(SbbTable) table: SbbTable<VehicleExampleItem>;

  columns = ['select', 'position', 'name', 'power', 'description', 'category'];
  dataSource = new SbbTableDataSource<VehicleExampleItem, VehicleFilter>(VEHICLE_EXAMPLE_DATA);
  selection = new SelectionModel<VehicleExampleItem>(true, []);
  selectedData: VehicleExampleItem[] = [];
  categories = new Set(
    VEHICLE_EXAMPLE_DATA.map((vehicleExampleItem) => vehicleExampleItem.category)
  );

  vehicleFilterForm = new FormGroup({
    category: new FormControl([] as string[]),
    name: new FormControl(''),
    description: new FormControl(''),
  });

  includeFilteredCtrl = new FormControl(true);

  private _destroyed = new Subject<void>();

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected >= numRows;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.vehicleFilterForm.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe((vehicleFilterForm) => {
        this.dataSource.filter = vehicleFilterForm;
        this.updateSelectedData();
      });

    merge(this.selection.changed, this.includeFilteredCtrl.valueChanges)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.updateSelectedData());
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach((row) => this.selection.select(row));
  }

  /** Updates the list of selected data */
  updateSelectedData() {
    this.selectedData = this.selection.selected.filter(
      (item) => this.includeFilteredCtrl.value || this.dataSource.filteredData.includes(item)
    );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: VehicleExampleItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngOnDestroy(): void {
    this._destroyed.next();
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
