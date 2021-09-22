import { Component, NgModule, ViewChild } from '@angular/core';
import {
  SbbSort,
  SbbSortDirective,
  SbbSortHeaderComponent,
  SbbTableModule,
} from '@sbb-esta/angular-business';

@Component({
  template: `
    <table sbbTable sbbSort>
      <tr>
        <sbbHeaderCell></sbbHeaderCell>
        <th sbbHeaderCell></th>
        <sbbCell></sbbCell>
        <td sbbCell></td>
        <sbbFooterCell></sbbFooterCell>
        <td sbbFooterCell></td>
      </tr>
      <tr sbbHeaderRow>
        <td class="sbb-col-center-align" [sbbSortHeader]=""></td>
      </tr>
      <tr sbbRow></tr>
      <tr sbbFooterRow></tr>
    </table>
    <table></table>
    <table class="special-table"></table>
    <table class="sbb-table"></table>
  `,
})
export class TableTestComponent {
  header: SbbSortHeaderComponent;
  @ViewChild(SbbSortDirective) sbbSort: SbbSortDirective;
  sbbSortState: SbbSort;
}

@NgModule({
  declarations: [TableTestComponent],
  imports: [SbbTableModule],
})
export class TableTestModule {}
