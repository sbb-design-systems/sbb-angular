import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { merge, Subject } from 'rxjs';
import { distinctUntilChanged, mapTo, takeUntil } from 'rxjs/operators';

const stickySupported =
  typeof CSS !== 'undefined' &&
  CSS.supports(
    ['', '-o-', '-webkit-', '-moz-', '-ms-'].map(p => `(position: ${p}sticky)`).join(' or ')
  );

@Component({
  selector: 'sbb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnChanges, OnDestroy {
  /** Table identifier. */
  @Input() tableId: string;
  /** The labelledBy of the table component.*/
  @Input() tableLabelledBy: string;
  /** Types of table alignment. */
  @Input() tableAlignment: 'none' | 'left' | 'center' | 'right';
  /** Types of pin mode. */
  @Input() pinMode: 'off' | 'on' = 'off';
  /** Class value of the table. */
  @Input()
  set tableClass(classVal: string) {
    this._tableClass = classVal;
  }
  get tableClass() {
    let classList = 'sbb-table ';

    if (this._tableClass) {
      classList += this._tableClass;
    }

    if (this.tableAlignment && this.tableAlignment !== 'none') {
      classList += ' sbb-table-align-' + this.tableAlignment;
    }

    return classList;
  }
  private _tableClass: string;

  /** @docs-private */
  @ViewChild(PerfectScrollbarComponent, { static: true })
  _perfectScrollbar: PerfectScrollbarComponent;

  /** @docs-private */
  @HostBinding('class.sbb-table-is-scrolling') _scrolling = false;
  /** @docs-private */
  @HostBinding('class.sbb-table-is-pinned') get _pinned() {
    return this.pinMode === 'on';
  }

  private _scrollListener = new Subject();

  constructor(private _zone: NgZone, private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!stickySupported) {
      return;
    } else if (
      changes.pinMode.currentValue === 'on' &&
      (changes.pinMode.firstChange ||
        changes.pinMode.previousValue !== changes.pinMode.currentValue)
    ) {
      merge(
        this._perfectScrollbar.psXReachStart.pipe(mapTo(false)),
        this._perfectScrollbar.psScrollRight.pipe(mapTo(true))
      )
        .pipe(
          takeUntil(this._scrollListener),
          distinctUntilChanged()
        )
        .subscribe(v =>
          this._zone.run(() => {
            this._scrolling = v;
            this._changeDetectorRef.markForCheck();
          })
        );
    } else if (
      changes.pinMode.currentValue === 'off' &&
      changes.pinMode.previousValue !== changes.pinMode.currentValue
    ) {
      this._scrollListener.next();
      this._scrolling = false;
    }
  }

  ngOnDestroy(): void {
    this._scrollListener.next();
    this._scrollListener.complete();
  }
}
