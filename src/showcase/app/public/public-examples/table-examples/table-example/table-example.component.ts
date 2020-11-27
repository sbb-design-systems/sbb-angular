import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-table-example',
  templateUrl: './table-example.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TableExampleComponent {
  headers = [
    'Company and country *1',
    'Passenger-kilometers (Mio. Pkm)',
    'Tonne-kilometers (Mio. Ntkm)',
    'Route-kilometers (Mio. Trkm)',
    'Staff (FTE)',
  ];

  private _rows = [
    {
      text1: 'Long text in a link to see how it wraps in the cell. *1',
      text2: '6 907',
      text3: 'Long text in a link to see how it wraps in the cell.',
      text4: 'Long text in a link to see how exactly the cell wraps',
      text5: '24 882',
      scope: 'row',
      describedby: 'legend_item_1',
    },
    {
      text1: 'SZDC (CZ) *2',
      text2: '-',
      text3: '-',
      text4: '161',
      text5: '17 380',
      scope: 'row',
      describedby: 'legend_item_2',
    },
    {
      text1: 'DB AG (DE) *3',
      text2: '80 805',
      text3: '78 542',
      text4: '1 037',
      text5: '286 237',
      scope: 'row',
      describedby: 'legend_item_3',
    },
    {
      text1: 'FS (IT) *3',
      text2: '37 489',
      text3: '22 081',
      text4: '316',
      text5: '72 341',
      scope: 'row',
      describedby: 'legend_item_3',
    },
    {
      text1: 'JR (JP) *3',
      text2: '244 591',
      text3: '20 255',
      text4: '693',
      text5: '127 989',
      scope: 'row',
      describedby: 'legend_item_3',
    },
    {
      text1: 'NS (NL) *1',
      text2: '16 604',
      text3: '-',
      text4: '-',
      text5: '7 959',
      scope: 'row',
      describedby: 'legend_item_1',
    },
  ];

  rows = this._rows.slice();

  currentAlignment = 'center';

  alignments = ['none', 'left', 'center', 'right'];

  isFirstColumnPinned = false;

  removeRow() {
    this.rows.splice(this.rows.length - 1, 1);
  }

  resetRows() {
    this.rows = this._rows.slice();
  }

  filterTable(evt: any) {
    const value = evt.target.value;

    if (value !== '') {
      this.rows = this._rows.filter((row) => {
        if (row.text1.indexOf(value) !== -1) {
          return true;
        }
        if (row.text2.indexOf(value) !== -1) {
          return true;
        }
        if (row.text3.indexOf(value) !== -1) {
          return true;
        }
        if (row.text4.indexOf(value) !== -1) {
          return true;
        }
        if (row.text5.indexOf(value) !== -1) {
          return true;
        }

        return false;
      });
    } else {
      this.rows = this._rows.slice();
    }
  }
}
