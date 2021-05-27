import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  LOCALE_ID,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { SbbDateAdapter } from '@sbb-esta/angular/core';
import { merge, Subject, Subscription } from 'rxjs';
import { bufferCount, filter, mapTo, take, tap } from 'rxjs/operators';

import { SbbDateInput } from '../date-input/date-input.directive';
import { SbbDatepickerContent } from '../datepicker-content/datepicker-content';
import { createMissingDateImplError } from '../datepicker-errors';
import { SBB_DATEPICKER } from '../datepicker-token';

/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;

/** Injection token that determines the scroll handling while the calendar is open. */
export const SBB_DATEPICKER_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-datepicker-scroll-strategy'
);

/** @docs-private */
export function SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_DATEPICKER_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY,
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sbb-datepicker',
  templateUrl: './datepicker.html',
  styleUrls: ['./datepicker.css'],
  exportAs: 'sbbDatepicker',
  providers: [{ provide: SBB_DATEPICKER, useExisting: SbbDatepicker }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-datepicker',
    '[class.sbb-datepicker-arrows-enabled]': 'this.arrows',
    '[class.sbb-datepicker-toggle-enabled]': 'this.toggle',
    '[class.sbb-datepicker-disabled]': 'this.disabled',
  },
})
export class SbbDatepicker<D> implements OnDestroy {
  /** An input indicating the type of the custom header component for the calendar, if set. */
  @Input() calendarHeaderComponent: ComponentType<any>;

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return this._startAt || (this.datepickerInput ? this.datepickerInput.value : null);
  }
  set startAt(value: D | null) {
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _startAt: D | null;

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this.datepickerInput
      ? this.datepickerInput.disabled
      : !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this.disabledChange.next(newValue);
    }
  }
  private _disabled?: boolean;

  /** Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[];

  /** Second datepicker to be used in 2 datepickers use case */
  @Input()
  set connected(value: SbbDatepicker<D> | null) {
    if (value !== this._connected && this._connected) {
      this._connected.main = null;
    }
    if (value) {
      value.main = this;
    }
    this._connected = value;
  }
  get connected(): SbbDatepicker<D> | null {
    return this._connected;
  }
  private _connected: SbbDatepicker<D> | null;

  main: SbbDatepicker<D> | null;

  /**
   * Whether arrows are enabled, which allow navigation to the next/previous day.
   * They also support min and max date limits.
   * Defaults to false.
   */
  @Input()
  set arrows(value: any) {
    this._arrows = coerceBooleanProperty(value);
  }
  get arrows() {
    return this._arrows;
  }
  private _arrows = false;

  /** Whether the datepicker toggle is enabled. Defaults to true. */
  @Input()
  set toggle(value: any) {
    this._toggle = coerceBooleanProperty(value);
  }
  get toggle() {
    return this._toggle;
  }
  private _toggle = true;

  /** Emits when the datepicker has been opened. */
  // tslint:disable-next-line:no-output-rename
  @Output('opened') openedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  // tslint:disable-next-line:no-output-rename
  @Output('closed') closedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: boolean) {
    value ? this.open() : this.close();
  }
  private _opened = false;

  /** The id for the datepicker calendar. */
  id: string = `sbb-datepicker-${datepickerUid++}`;

  /** The currently selected date. */
  get selected(): D | null {
    return this._validSelected;
  }
  set selected(value: D | null) {
    this._validSelected = value;
    this._changeDetectorRef.markForCheck();
  }
  private _validSelected: D | null = null;

  /** The minimum selectable date. */
  get minDate(): D | null {
    return this.datepickerInput && this.datepickerInput.min;
  }

  /** The maximum selectable date. */
  get maxDate(): D | null {
    return this.datepickerInput && this.datepickerInput.max;
  }

  get dateFilter(): (date: D | null) => boolean {
    return this.datepickerInput && this.datepickerInput.dateFilter;
  }

  get prevDayActive() {
    return (
      this.arrows &&
      this.datepickerInput &&
      !!this.datepickerInput.value &&
      (!this.minDate || this._dateAdapter.compareDate(this.datepickerInput.value, this.minDate) > 0)
    );
  }

  get nextDayActive() {
    return (
      this.arrows &&
      this.datepickerInput &&
      !!this.datepickerInput.value &&
      (!this.maxDate || this._dateAdapter.compareDate(this.datepickerInput.value, this.maxDate) < 0)
    );
  }

  /** A reference to the overlay when the calendar is opened as a popup. */
  popupRef: OverlayRef;

  /** A portal containing the calendar for this datepicker. */
  private _calendarPortal: ComponentPortal<SbbDatepickerContent<D>>;

  /** Reference to the component instantiated in popup mode. */
  private _popupComponentRef: ComponentRef<SbbDatepickerContent<D>> | null;

  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  /** Subscription to value changes in the associated input element. */
  private _inputSubscription = Subscription.EMPTY;

  private _inputDisabledSubscription = Subscription.EMPTY;

  private _connectedDatepickerSubscription = Subscription.EMPTY;

  private _posStrategySubsription = Subscription.EMPTY;

  /** The input element this datepicker is associated with. */
  datepickerInput: SbbDateInput<D>;

  /** Emits when the datepicker is disabled. */
  readonly disabledChange = new Subject<boolean>();

  /** Emits new selected date when selected date changes. */
  readonly selectedChanged = new Subject<D>();

  constructor(
    private _overlay: Overlay,
    private _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(SBB_DATEPICKER_SCROLL_STRATEGY) private _scrollStrategy: any,
    @Optional() private _dateAdapter: SbbDateAdapter<D>,
    @Optional() @Inject(DOCUMENT) private _document: any,
    @Inject(LOCALE_ID) public locale: string
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    this._dateAdapter.setLocale(locale);
  }

  ngOnDestroy() {
    this.close();
    this._inputSubscription.unsubscribe();
    this._inputDisabledSubscription.unsubscribe();
    this._connectedDatepickerSubscription.unsubscribe();
    this.disabledChange.complete();

    if (this.popupRef) {
      this._posStrategySubsription.unsubscribe();
      this.popupRef.dispose();
      this._popupComponentRef = null;
    }
  }

  /** Selects the given date */
  select(date: D): void {
    const oldValue = this.selected;
    this.selected = date;
    if (!this._dateAdapter.sameDate(oldValue, this.selected)) {
      this.selectedChanged.next(date);
    }
  }

  nextDay() {
    if (this.selected) {
      this.selected = this._dateAdapter.addCalendarDays(this.selected, 1);
      this.selectedChanged.next(this.selected);
    }
  }

  prevDay() {
    if (this.selected) {
      this.selected = this._dateAdapter.addCalendarDays(this.selected, -1);
      this.selectedChanged.next(this.selected);
    }
  }

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  registerInput(input: SbbDateInput<D>): void {
    if (this.datepickerInput) {
      throw Error('A SbbDatepicker can only be associated with a single input.');
    }
    this.datepickerInput = input;
    this._inputSubscription = this.datepickerInput.valueChange.subscribe(
      (value: D | null) => (this.selected = value)
    );
    this._inputDisabledSubscription = this.datepickerInput.disabledChange.subscribe(() =>
      this._changeDetectorRef.markForCheck()
    );
    // The connected datepicker is only opened on the following conditions:
    // This datepicker has a connected datepicker and has been opened, a value selected, closed
    // and the connected datepicker has no value or a value before the selected date.
    this._connectedDatepickerSubscription = merge(
      this.openedStream.pipe(mapTo('opened')),
      this.selectedChanged.pipe(mapTo('selected')),
      this.closedStream.pipe(mapTo('closed'))
    )
      .pipe(
        bufferCount(3, 1),
        filter(
          ([o, s, c]) =>
            !!this.connected &&
            !!this.datepickerInput.value &&
            o === 'opened' &&
            s === 'selected' &&
            c === 'closed' &&
            (!this.connected.datepickerInput.value ||
              this._dateAdapter.compareDate(
                this.datepickerInput.value,
                this.connected.datepickerInput.value
              ) > 0)
        ),
        tap(() => {
          if (this.connected!.datepickerInput.value) {
            this.connected!.datepickerInput.value = null;
          }
        })
      )
      .subscribe(() => this.connected!.open());
  }

  /** Open the calendar. */
  open(): void {
    if (this._opened || this.disabled) {
      return;
    }
    if (!this.datepickerInput) {
      throw Error('Attempted to open an SbbDatepicker with no associated input.');
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }

    this._openAsPopup();
    this._opened = true;
    this.openedStream.emit();
  }

  /** Close the calendar. */
  close(): void {
    if (!this._opened) {
      return;
    }
    if (this.popupRef && this.popupRef.hasAttached()) {
      this.popupRef.detach();
    }
    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this._opened) {
        this._opened = false;
        this.closedStream.emit();
        this._focusedElementBeforeOpen = null;
      }
    };

    if (
      this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function'
    ) {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  private _getPanelClasses(): Array<string> {
    return [
      'sbb-datepicker-popup',
      this.arrows ? 'sbb-datepicker-with-arrows' : 'sbb-datepicker-no-arrows',
    ];
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal<SbbDatepickerContent<D>>(
        SbbDatepickerContent,
        this._viewContainerRef
      );
    }

    if (!this.popupRef) {
      this._createPopup();
    } else {
      this.popupRef.getConfig().panelClass = this._getPanelClasses();
    }

    if (!this.popupRef.hasAttached()) {
      this._popupComponentRef = this.popupRef.attach(this._calendarPortal);
      this._popupComponentRef.instance.datepicker = this;

      // Update the position once the calendar has rendered.
      this._ngZone.onStable
        .asObservable()
        .pipe(take(1))
        .subscribe(() => {
          this.popupRef.updatePosition();
        });
    }
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'sbb-overlay-transparent-backdrop',
      scrollStrategy: this._scrollStrategy(),
      panelClass: this._getPanelClasses(),
    });

    this.popupRef = this._overlay.create(overlayConfig);
    this.popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this.popupRef.backdropClick(),
      this.popupRef.detachments(),
      this.popupRef.keydownEvents().pipe(
        filter((event) => {
          // Closing on alt + up is only valid when there's an input associated with the datepicker.
          return (
            event.keyCode === ESCAPE ||
            (this.datepickerInput && event.altKey && event.keyCode === UP_ARROW)
          );
        })
      )
    ).subscribe(() => this.close());
  }

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    const posStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this.datepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.sbb-datepicker-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);

    this._posStrategySubsription = posStrategy.positionChanges.subscribe((pos) => {
      if (pos.connectionPair.originY === 'top') {
        this.popupRef.hostElement.classList.add('sbb-datepicker-popup-above');
      } else {
        this.popupRef.hostElement.classList.remove('sbb-datepicker-popup-above');
      }
    });

    return posStrategy;
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj) ? obj : null;
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_arrows: BooleanInput;
  static ngAcceptInputType_toggle: BooleanInput;
}
