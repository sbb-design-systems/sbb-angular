import { FocusableOption, FocusKeyManager, FocusOrigin } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbRow, SbbTableDataSource } from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';
import { startWith } from 'rxjs/operators';

interface FocusableRow extends FocusableOption {
  row: ElementRef;
}

/**
 * @title Cell Actions incl. Keyboard Navigation Support
 * @order 90
 */
@Component({
  selector: 'sbb-cell-actions-table-example',
  templateUrl: 'cell-actions-table-example.html',
  imports: [SbbTableModule, SbbButtonModule, SbbIconModule],
})
export class CellActionsTableExample implements AfterViewInit {
  displayedColumns: string[] = ['vehicle', 'manufacturer', 'price'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(EXAMPLE_DATA);

  @ViewChildren(SbbRow, { read: ElementRef }) _sbbRows: QueryList<ElementRef<HTMLElement>>;
  private _focusableRows = new QueryList<FocusableRow>();

  _focusKeyManager?: FocusKeyManager<FocusableRow>;

  ngAfterViewInit(): void {
    this._focusKeyManager = new FocusKeyManager(this._focusableRows).withWrap();

    this._sbbRows.changes
      .pipe(startWith(this._sbbRows))
      .subscribe((rows: QueryList<ElementRef<HTMLElement>>) => {
        const updatedRows = rows.map(
          (row) =>
            ({
              row,
              focus: (origin?: FocusOrigin) => {
                this._resetRowFocus(row);
                row.nativeElement.focus();
              },
            }) as FocusableRow,
        );
        this._focusableRows.reset(updatedRows);
        this._focusableRows.notifyOnChanges();

        this._resetRowFocus(rows.first);
        this._focusKeyManager?.updateActiveItem(0);
      });
  }

  private _resetRowFocus(focusableRow: ElementRef<HTMLElement>) {
    this._sbbRows.forEach((rowOfRows) => rowOfRows.nativeElement.removeAttribute('tabindex'));
    focusableRow.nativeElement.setAttribute('tabindex', '0');
  }

  logRowClicked() {
    console.log('row clicked');
    // Navigate to detail page
  }

  logActionButtonClicked(event: any) {
    event.stopPropagation();
    console.log('button clicked');
  }

  handleKeydown(event: KeyboardEvent) {
    this._focusKeyManager!.onKeydown(event);
  }
}

const EXAMPLE_DATA = [
  {
    vehicle: 'Re 420',
    manufacturer: 'Schweizerische Lok- und Maschinenfabrik Winterthur (SLM)',
    price: '450000',
  },
  {
    vehicle: 'Re 460',
    manufacturer: 'Schweizerische Lok- und Maschinenfabrik Winterthur (SLM)',
    price: '2000000',
  },
  {
    vehicle: 'Am 841',
    manufacturer: 'GEC Alstom',
    price: '200000',
  },
  {
    vehicle: 'RABDe 500 ICN',
    manufacturer: 'Bombardier Transportation',
    price: 'on request',
  },
];
