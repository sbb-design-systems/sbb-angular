import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { take } from 'rxjs/operators';

/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export class SbbCalendarCell {
  constructor(
    public value: number,
    public displayValue: string,
    public ariaLabel: string,
    public enabled: boolean,
    public rangeBackground?: string | null
  ) {}
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sbb-calendar-body]',
  templateUrl: './calendar-body.html',
  exportAs: 'sbbCalendarBody',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-calendar-body',
    '[attr.aria-readonly]': 'true',
    role: 'grid',
  },
})
export class SbbCalendarBody implements AfterViewChecked {
  /**
   * Used to focus the active cell after change detection has run.
   */
  private _focusActiveCellAfterViewChecked = false;

  /** The label for the table. (e.g. "Jan 2017"). */
  @Input() label: string;

  /** The cells to display in the table. */
  @Input() rows: SbbCalendarCell[][];

  /** The value in the table that corresponds to today. */
  @Input() todayValue: number;

  /** The value in the table that is currently selected. */
  @Input() selectedValue: number;

  /** The minimum number of free cells needed to fit the label in the first row. */
  @Input() labelMinRequiredCells: number;

  /** The number of columns in the table. */
  @Input() numCols: number = 7;

  /** Whether to allow selection of disabled cells. */
  @Input() allowDisabledSelection: boolean = false;

  /** The cell number of the active cell in the table. */
  @Input() activeCell: number = 0;

  /** Emits when a new value is selected. */
  @Output() readonly selectedValueChange: EventEmitter<number> = new EventEmitter<number>();

  @Output() readonly activeDateChange = new EventEmitter<number>();

  constructor(private _elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {}

  ngAfterViewChecked() {
    if (this._focusActiveCellAfterViewChecked) {
      this.focusActiveCell();
      this._focusActiveCellAfterViewChecked = false;
    }
  }

  cellClicked(cell: SbbCalendarCell): void {
    if (!this.allowDisabledSelection && !cell.enabled) {
      return;
    }
    this.selectedValueChange.emit(cell.value);
  }

  _emitActiveDateChange(cell: SbbCalendarCell, event: FocusEvent): void {
    if (cell.enabled) {
      this.activeDateChange.emit(cell.value);
    }
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

  /**
   * Focuses the active cell after the microtask queue is empty.
   *
   * Adding a 0ms setTimeout seems to fix Voiceover losing focus when pressing PageUp/PageDown
   * (issue angular/components#24330).
   *
   * Determined a 0ms by gradually increasing duration from 0 and testing two use cases with screen
   * reader enabled:
   *
   * 1. Pressing PageUp/PageDown repeatedly with pausing between each key press.
   * 2. Pressing and holding the PageDown key with repeated keys enabled.
   *
   * Test 1 worked roughly 95-99% of the time with 0ms and got a little bit better as the duration
   * increased. Test 2 got slightly better until the duration was long enough to interfere with
   * repeated keys. If the repeated key speed was faster than the timeout duration, then pressing
   * and holding pagedown caused the entire page to scroll.
   *
   * Since repeated key speed can verify across machines, determined that any duration could
   * potentially interfere with repeated keys. 0ms would be best because it almost entirely
   * eliminates the focus being lost in Voiceover without causing unintended side effects.
   * Adding delay also complicates writing tests.
   */
  focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable
        .asObservable()
        .pipe(take(1))
        .subscribe(() => {
          setTimeout(() => {
            const activeCell: HTMLElement | null = this._elementRef.nativeElement.querySelector(
              '.sbb-calendar-body-active'
            );

            if (activeCell) {
              activeCell.focus();
            }
          });
        });
    });
  }

  /** Focuses the active cell after change detection has run and the microtask queue is empty. */
  _scheduleFocusActiveCellAfterViewChecked() {
    this._focusActiveCellAfterViewChecked = true;
  }
}
