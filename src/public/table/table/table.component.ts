import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

const stickySupported =
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports(
    ['', '-o-', '-webkit-', '-moz-', '-ms-'].map(p => `(position: ${p}sticky)`).join(' or ')
  );

@Component({
  selector: 'sbb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
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
  @HostBinding('class.sbb-table-is-scrolling') _scrolling = false;
  /** @docs-private */
  @HostBinding('class.sbb-table-is-pinned') get _pinned() {
    return this.pinMode === 'on';
  }

  /**
   * Reference to the scroll container of the table.
   * @docs-private
   */
  @ViewChild('scrollContainer', { static: true }) _scrollContainer: ElementRef<HTMLElement>;

  private _scrollListener = new Subject();

  constructor(private _zone: NgZone, private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!stickySupported) {
      return;
    } else if (
      changes.pinMode &&
      changes.pinMode.currentValue === 'on' &&
      (changes.pinMode.firstChange ||
        changes.pinMode.previousValue !== changes.pinMode.currentValue)
    ) {
      this._zone.runOutsideAngular(() =>
        fromEvent(this._scrollContainer.nativeElement, 'scroll')
          .pipe(
            startWith(null),
            takeUntil(this._scrollListener),
            map(() => this._scrollContainer.nativeElement.scrollLeft > 0),
            distinctUntilChanged()
          )
          .subscribe(v =>
            this._zone.run(() => {
              this._scrolling = v;
              this._changeDetectorRef.markForCheck();
            })
          )
      );
    } else if (
      changes.pinMode &&
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
