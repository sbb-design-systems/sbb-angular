import { Component, NgModule } from '@angular/core';
import { SbbSortHeaderComponent, SbbTableModule } from '@sbb-esta/angular-business';

@Component({
  template: `
    <table sbbTable>
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
  `,
})
export class TableTestComponent {
  header: SbbSortHeaderComponent;
}

@NgModule({
  declarations: [TableTestComponent],
  imports: [SbbTableModule],
})
export class TableTestModule {}
