import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbSortState, SbbSort, SbbSortHeader, SbbTableModule } from '@sbb-esta/angular/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  template: `
    <table sbb-table sbbSort>
      <tr>
        <th sbb-header-cell></th>
        <td sbb-cell></td>
        <td sbb-footer-cell></td>
      </tr>
      <tr sbb-header-row>
        <td class="sbb-table-align-center" [sbb-sort-header]=""></td>
      </tr>
      <tr
        sbb-row
        *sbbRowDef="let row; columns: displayedColumns"
        (click)="selection.toggle(row)"
      ></tr>
      <tr sbb-footer-row></tr>
    </table>
    <table class="sbb-table"></table><!-- TODO: Check if table styles are still as desired -->
    <table class="special-table sbb-table"></table><!-- TODO: Check if table styles are still as desired -->
    <table class="sbb-table"></table>
  `,
})
export class TableTestComponent {
  header: SbbSortHeader;
  @ViewChild(SbbSort) sbbSort: SbbSort;
  sbbSortState: SbbSortState;
  selection: SelectionModel<any>;
}

@NgModule({
  declarations: [TableTestComponent],
  imports: [SbbTableModule],
})
export class TableTestModule {}
