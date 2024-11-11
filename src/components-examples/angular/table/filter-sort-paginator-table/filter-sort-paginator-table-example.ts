import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbPaginator } from '@sbb-esta/angular/pagination';
import { SbbPaginationModule } from '@sbb-esta/angular/pagination';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import {
  SbbSort,
  SbbSortState,
  SbbTable,
  SbbTableDataSource,
  SbbTableFilter,
} from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

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
 * @title Filter Sort Paginator Table
 * @order 80
 */
@Component({
  selector: 'sbb-filter-sort-paginator-table-example',
  styleUrls: ['filter-sort-paginator-table-example.css'],
  templateUrl: 'filter-sort-paginator-table-example.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbTableModule,
    SbbAutocompleteModule,
    SbbOptionModule,
    SbbSelectModule,
    SbbPaginationModule,
    AsyncPipe,
  ],
})
export class FilterSortPaginatorTableExample implements AfterViewInit, OnDestroy {
  @ViewChild(SbbPaginator) paginator: SbbPaginator;
  @ViewChild(SbbSort) sort: SbbSort;
  @ViewChild(SbbTable) table: SbbTable<VehicleExampleItem>;

  columns = [
    { title: 'position' },
    { title: 'name', subtitle: 'technical' },
    { title: 'power', subtitle: 'horsepower' },
    { title: 'description', subtitle: 'common name' },
    { title: 'category' },
  ];

  get displayedColumns(): string[] {
    return this.columns.map((column) => column.title);
  }
  dataSource = new SbbTableDataSource<VehicleExampleItem, VehicleFilter>(VEHICLE_EXAMPLE_DATA);
  categories = new Set(
    VEHICLE_EXAMPLE_DATA.map((vehicleExampleItem) => vehicleExampleItem.category),
  );

  vehicleFilterForm = new FormGroup({
    _: new FormControl(''),
    category: new FormControl([] as string[]),
    name: new FormControl(''),
    description: new FormControl(''),
  });

  descriptions: Observable<string[]>;

  private _destroyed = new Subject<void>();
  private _liveAnnouncer = inject(LiveAnnouncer);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
    this.vehicleFilterForm.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe((vehicleFilterForm) => {
        this.dataSource.filter = vehicleFilterForm;
      });

    this.descriptions = this.vehicleFilterForm.get('description')!.valueChanges.pipe(
      distinctUntilChanged(),
      map((newValue) =>
        newValue?.length === 0
          ? []
          : [...new Set(this.dataSource.filteredData.map((vehicle) => vehicle.description))].sort(),
      ),
    );
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: SbbSortState) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
