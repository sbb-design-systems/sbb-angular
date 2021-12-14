import { Component, NgModule, ViewChild } from '@angular/core';
import {
  SbbSort,
  SbbSortDirective,
  SbbSortHeaderComponent,
  SbbTableModule,
} from '@sbb-esta/angular-business';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  template: `
    <table sbbTable sbbSort>
      <tr>
        <th sbbHeaderCell></th>
        <td sbbCell></td>
        <td sbbFooterCell></td>
      </tr>
      <tr sbbHeaderRow>
        <td class="sbb-col-center-align" [sbbSortHeader]=""></td>
      </tr>
      <tr
        sbbRow
        *sbbRowDef="let row; columns: displayedColumns"
        (click)="selection.toggle(row)"
      ></tr>
      <tr sbbFooterRow></tr>
    </table>
  `,
})
export class TableTestComponent {
  header: SbbSortHeaderComponent;
  @ViewChild(SbbSortDirective) sbbSort: SbbSortDirective;
  sbbSortState: SbbSort;
  selection: SelectionModel<any>;
}

@NgModule({
  declarations: [TableTestComponent],
  imports: [SbbTableModule],
})
export class TableTestModule {}
