import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbTable, SbbTableModule } from '@sbb-esta/angular-public';

@Component({
  template: `
    <sbb-table
      [tableId]="tableId"
      tableLabelledBy="caption"
      tableAlignment="center"
      [pinMode]="'on'"
      tableClass="specialTable"
      class="specialClass"
    >
      <thead>
        <tr>
          <th scope="col">Header</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Col1</td>
          <td>Col2</td>
          <td>Col3</td>
        </tr>
      </tbody>
    </sbb-table>
    <sbb-table [tableAlignment]="alignment" [tableClass]="class" pinMode="off">
      <tr>
        <td></td>
      </tr>
    </sbb-table>
  `,
})
export class TableTestComponent {
  @ViewChild(SbbTable) table: SbbTable;
  tableId = 'id';
  alignment = 'center';
  class = 'super-table';
}

@NgModule({
  declarations: [TableTestComponent],
  imports: [SbbTableModule],
})
export class TableTestModule {}
