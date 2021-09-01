import { Component, NgModule } from '@angular/core';
import { SbbSortHeader, SbbTableModule } from '@sbb-esta/angular/table';

@Component({
  template: `
    <table sbb-table>
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
  `,
})
export class TableTestComponent {
  header: SbbSortHeader;
}

@NgModule({
  declarations: [TableTestComponent],
  imports: [SbbTableModule],
})
export class TableTestModule {}
