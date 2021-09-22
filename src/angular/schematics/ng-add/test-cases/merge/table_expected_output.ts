import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbSortState, SbbSort, SbbSortHeader, SbbTableModule } from '@sbb-esta/angular/table';

@Component({
  template: `
    <table sbb-table sbbSort>
      <tr>
        <sbb-header-cell></sbb-header-cell>
        <th sbb-header-cell></th>
        <sbb-cell></sbb-cell>
        <td sbb-cell></td>
        <sbb-footer-cell></sbb-footer-cell>
        <td sbb-footer-cell></td>
      </tr>
      <tr sbb-header-row>
        <td class="sbb-table-align-center" [sbb-sort-header]=""></td>
      </tr>
      <tr sbb-row></tr>
      <tr sbb-footer-row></tr>
    </table>
    <table class="sbb-table"></table>
    <table class="special-table sbb-table"></table>
    <table class="sbb-table"></table>
  `,
})
export class TableTestComponent {
  header: SbbSortHeader;
  @ViewChild(SbbSort) sbbSort: SbbSort;
  sbbSortState: SbbSortState;
}

@NgModule({
  declarations: [TableTestComponent],
  imports: [SbbTableModule],
})
export class TableTestModule {}
