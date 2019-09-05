import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  NgZone,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { DateFormats, SBB_DATE_FORMATS } from '@sbb-esta/angular-core/datetime';
import { first } from 'rxjs/operators';

/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export class CalendarCell {
  constructor(
    public value: number,
    public displayValue: string,
    public enabled: boolean,
    public rangeBackground?: string | null
  ) {}
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sbb-calendar-body]',
  templateUrl: './calendar-body.component.html',
  exportAs: 'sbbCalendarBody',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarBodyComponent {
  @HostBinding('attr.role') role = 'grid';

  @HostBinding('attr.aria-readonly') ariaReadonly = true;

  @HostBinding('class.sbb-calendar-body') cssClass = true;

  /** The label for the table. (e.g. "Jan 2017"). */
  @Input() label: string;

  /** The cells to display in the table. */
  @Input() rows: CalendarCell[][];

  /** The value in the table that corresponds to today. */
  @Input() todayValue: number;

  /** The value in the table that is currently selected. */
  @Input() selectedValue: number;

  /** The minimum number of free cells needed to fit the label in the first row. */
  @Input() labelMinRequiredCells: number;

  /** The number of columns in the table. */
  @Input() numCols = 7;

  /** Whether to allow selection of disabled cells. */
  @Input() allowDisabledSelection = false;

  /** The cell number of the active cell in the table. */
  @Input() activeCell = 0;

  /**
   * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
   * maintained even as the table resizes.
   */
  @Input() cellAspectRatio = 1;

  /** Emits when a new value is selected. */
  @Output() readonly selectedValueChange: EventEmitter<number> = new EventEmitter<number>();

  a11yFormat: string;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: DateFormats
  ) {
    this.a11yFormat = this._dateFormats.dateA11yLabel;
  }

  cellClicked(cell: CalendarCell): void {
    if (!this.allowDisabledSelection && !cell.enabled) {
      return;
    }
    this.selectedValueChange.emit(cell.value);
  }

  /** The number of blank cells to put at the beginning for the first row. */
  get firstRowOffset(): number {
    return this.rows && this.rows.length && this.rows[0].length
      ? this.numCols - this.rows[0].length
      : 0;
  }

  isActiveCell(rowIndex: number, colIndex: number): boolean {
    let cellNumber = rowIndex * this.numCols + colIndex;

    // Account for the fact that the first row may not have as many cells.
    if (rowIndex) {
      cellNumber -= this.firstRowOffset;
    }

    return cellNumber === this.activeCell;
  }

  /** Focuses the active cell after the microtask queue is empty. */
  focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable
        .asObservable()
        .pipe(first())
        .subscribe(() => {
          const activeCell: HTMLElement | null = this._elementRef.nativeElement.querySelector(
            '.sbb-calendar-body-active'
          );

          if (activeCell) {
            activeCell.focus();
          }
        });
    });
  }
}
