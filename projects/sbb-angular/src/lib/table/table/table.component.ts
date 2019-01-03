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
  @Input() tableClass = '';
  @Input() tableLabelledBy: string;

  @ContentChild(TableCaptionDirective, { read: TemplateRef })
  tableCaption: TemplateRef<any>;
}
