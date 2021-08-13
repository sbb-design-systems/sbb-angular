import { Component, NgModule } from '@angular/core';
import { SbbTableModule } from '@sbb-esta/angular-business';

@Component({
  template: `
    <table class="sbb-table">
      <tr>
        <td class="sbb-col-center-align"></td>
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
