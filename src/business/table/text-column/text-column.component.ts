import { CdkTextColumn } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-text-column',
  template: `
    <ng-container sbbColumnDef>
      <th sbbHeaderCell *sbbHeaderCellDef [style.text-align]="justify">
        {{ headerText }}
      </th>
      <td sbbCell *sbbCellDef="let data" [style.text-align]="justify">
        {{ dataAccessor(data, name) }}
      </td>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class TextColumnComponent<T> extends CdkTextColumn<T> {}
