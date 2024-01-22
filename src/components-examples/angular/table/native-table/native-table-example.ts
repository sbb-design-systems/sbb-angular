import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTableModule } from '@sbb-esta/angular/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface RowEntry {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
  describedby: string;
}

/**
 * @title Simple Native Table
 * @order 100
 */
@Component({
  selector: 'sbb-native-table-example',
  templateUrl: 'native-table-example.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [SbbTableModule, SbbFormFieldModule, SbbInputModule, FormsModule, ReactiveFormsModule],
})
export class NativeTableExample implements OnDestroy {
  filterControl: FormControl = new FormControl('');
  rows = ROW_DATA.slice();
  private _destroyed = new Subject<void>();

  constructor() {
    this.filterControl.valueChanges.pipe(takeUntil(this._destroyed)).subscribe((value) => {
      const searchInProps: (keyof RowEntry)[] = ['col1', 'col2', 'col3', 'col4', 'col5'];

      if (value === '') {
        this.rows = ROW_DATA.slice();
        return;
      }
      this.rows = ROW_DATA.filter((row) =>
        searchInProps.some((prop) => row[prop].toUpperCase().includes(value.toUpperCase())),
      );
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}

const ROW_DATA: RowEntry[] = [
  {
    col1: 'Long text in a link to see how it wraps in the cell. *1',
    col2: '6 907',
    col3: 'Long text in a link to see how it wraps in the cell.',
    col4: 'Long text in a link to see how exactly the cell wraps',
    col5: '24 882',
    describedby: 'legend_item_1',
  },
  {
    col1: 'SZDC (CZ) *2',
    col2: '-',
    col3: '-',
    col4: '161',
    col5: '17 380',
    describedby: 'legend_item_2',
  },
  {
    col1: 'DB AG (DE) *3',
    col2: '80 805',
    col3: '78 542',
    col4: '1 037',
    col5: '286 237',
    describedby: 'legend_item_3',
  },
  {
    col1: 'FS (IT) *3',
    col2: '37 489',
    col3: '22 081',
    col4: '316',
    col5: '72 341',
    describedby: 'legend_item_3',
  },
  {
    col1: 'JR (JP) *3',
    col2: '244 591',
    col3: '20 255',
    col4: '693',
    col5: '127 989',
    describedby: 'legend_item_3',
  },
  {
    col1: 'NS (NL) *1',
    col2: '16 604',
    col3: '-',
    col4: '-',
    col5: '7 959',
    describedby: 'legend_item_1',
  },
];
