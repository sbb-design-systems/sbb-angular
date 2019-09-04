import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TableComponent {
  /** Table identifier. */
  @Input() tableId: string;
  /** The labelledBy of the table component.*/
  @Input() tableLabelledBy: string;
  /** Types of table alignment. */
  @Input() tableAlignment: 'none' | 'left' | 'center' | 'right';
  /** Types of pin mode. */
  @Input() pinMode: 'off' | 'on' = 'off';

  private _tableClass: string;
  /** Class value of the table. */
  @Input()
  set tableClass(classVal: string) {
    this._tableClass = classVal;
  }
  get tableClass() {
    let classList = 'sbb-table ';

    if (this._tableClass) {
      classList += this._tableClass;
    }

    if (this.tableAlignment && this.tableAlignment !== 'none') {
      classList += ' sbb-table-align-' + this.tableAlignment;
    }

    return classList;
  }
}
