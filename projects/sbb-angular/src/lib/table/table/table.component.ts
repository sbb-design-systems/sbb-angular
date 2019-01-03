import { Component, TemplateRef, ContentChild, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { TableCaptionDirective } from './table-caption.directive';

@Component({
  selector: 'sbb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TableComponent {
  @Input() tableId: string;
  @Input() tableLabelledBy: string;
  @Input() tableAlignment: 'none' | 'left' | 'center' | 'right';

  private _tableClass: string;

  @Input()
  set tableClass(classVal: string) {
    this._tableClass = classVal;
  }
  get tableClass() {
    let classList = this._tableClass;

    if (this.tableAlignment && this.tableAlignment !== 'none') {
      classList += ' sbb-table-align-' + this.tableAlignment;
    }

    return classList;
  }

  @ContentChild(TableCaptionDirective, { read: TemplateRef })
  tableCaption: TemplateRef<any>;
}
