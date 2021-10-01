import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbTable, SbbTableModule } from '@sbb-esta/angular/table';

@Component({
  template: `
    <sbb-table-wrapper
     
     
     
     
     
      class="specialClass"
    ><table class="sbb-table specialTable sbb-table-align-center" [attr.id]="tableId" aria-labelledby="caption"><!-- TODO: Could not migrate pinMode of former sbb-table, please manually add sticky css classes or migrate to more powerful [sbb-table] attribute usage and use its sticky modes there (see documentation) -->
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
    </table></sbb-table-wrapper>
    <sbb-table-wrapper><table [class]="'sbb-table' + class"><!-- TODO: Could not migrate tableAlignment property, please manually add css class (see documentation) -->
      <tr>
        <td></td>
      </tr>
    </table></sbb-table-wrapper>
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
