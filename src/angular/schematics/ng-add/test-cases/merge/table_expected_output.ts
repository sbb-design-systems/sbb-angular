import { Component, NgModule } from '@angular/core';
import { SbbTableModule } from '@sbb-esta/angular/table';

@Component({
  template: `
    <table class="sbb-table">
      <tr>
        <td class="sbb-table-align-center"></td>
      </tr>
    </table>
  `,
})
export class TableTestComponent {}

@NgModule({
  declarations: [TableTestComponent],
  imports: [SbbTableModule],
})
export class TableTestModule {}
