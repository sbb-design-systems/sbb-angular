import { Component, OnInit, HostBinding, TemplateRef, ContentChild } from '@angular/core';
import { TableCaptionDirective } from './table-caption.directive';

@Component({
  selector: 'sbb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ContentChild(TableCaptionDirective, { read: TemplateRef }) tableCaption: TemplateRef<any>;

  ngOnInit() {

  }
}
