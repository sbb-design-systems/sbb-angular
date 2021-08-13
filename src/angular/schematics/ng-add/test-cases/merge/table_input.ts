import { Component, NgModule } from '@angular/core';
import { SbbSortHeaderComponent, SbbTableModule } from '@sbb-esta/angular-business';

@Component({
  template: `
    <table sbbTable>
      <tr sbbHeaderRow>
        <td class="sbb-col-center-align" [sbbSortHeader]=""></td>
      </tr>
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
