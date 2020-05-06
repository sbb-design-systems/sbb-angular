import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SbbPaginatorComponent } from '@sbb-esta/angular-business/pagination';
import {
  SbbSortDirective,
  SbbTableDataSource,
  TableComponent,
  TableFilter
} from '@sbb-esta/angular-business/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VehicleExampleItem, VEHICLE_EXAMPLE_DATA } from '../table-example-data';

interface VehicleFilter extends TableFilter {
  category?: string[];
  name?: string;
  description?: string;
}

@Component({
  selector: 'sbb-filter-sort-paginator-table-example',
  templateUrl: './filter-sort-paginator-table-example.component.html'
})
export class FilterSortPaginatorTableExampleComponent implements AfterViewInit, OnDestroy {
  @ViewChild(SbbPaginatorComponent) paginator: SbbPaginatorComponent;
  @ViewChild(SbbSortDirective) sort: SbbSortDirective;
  @ViewChild(TableComponent) table: TableComponent<VehicleExampleItem>;

  displayedColumns: string[] = ['position', 'name', 'power', 'description', 'category'];

  dataSource = new SbbTableDataSource<VehicleExampleItem, VehicleFilter>(VEHICLE_EXAMPLE_DATA);
  categories = new Set(VEHICLE_EXAMPLE_DATA.map(vehicleExampleItem => vehicleExampleItem.category));

  vehicleFilterForm = new FormGroup({
    _: new FormControl(''),
    category: new FormControl(),
    name: new FormControl(''),
    description: new FormControl('')
  });

  private _destroyed = new Subject<void>();

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
    this.vehicleFilterForm.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe((vehicleFilterForm: VehicleFilter) => {
        this.dataSource.filter = vehicleFilterForm;
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}
