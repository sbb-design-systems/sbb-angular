import { Component, NgModule } from '@angular/core';
import { SbbSortHeader, SbbTableModule } from '@sbb-esta/angular/table';

@Component({
  template: `
    <table class="sbb-table">
      <tr>
        <td class="sbb-table-align-center" [sbb-sort-header]=""></td>
      </tr>
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
