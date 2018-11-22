import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
import { take, filter } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  Optional,
  Output,
  ViewContainerRef,
  ViewEncapsulation,
  OnDestroy,
  LOCALE_ID,
} from '@angular/core';
import { merge, Subject, Subscription } from 'rxjs';
import { DatepickerContentComponent } from '../datepicker-content/datepicker-content.component';
import { DatepickerInputDirective } from '../datepicker-input/datepicker-input.directive';
import { DateAdapter } from '../date-adapter';
import { createMissingDateImplError } from '../datepicker-errors';

/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;

/** Injection token that determines the scroll handling while the calendar is open. */
export const SBB_DATEPICKER_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('sbb-datepicker-scroll-strategy');

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

// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDatepicker"). We can change this to a directive
// if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sbb-datepicker',
  template: '',
  exportAs: 'sbbDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DatepickerComponent<D> implements OnDestroy {
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
    this._startAt = this.getValidDateOrNull(this.dateAdapter.deserialize(value));
  }
  private _startAt: D | null;

  /** The view that the calendar should start in. */
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this.datepickerInput ?
      this.datepickerInput.disabled : !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this.disabledChange.next(newValue);
    }
  }
  private _disabled: boolean;

  /**
   * Emits selected year in multiyear view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly yearSelected: EventEmitter<D> = new EventEmitter<D>();

  /**
   * Emits selected month in year view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly monthSelected: EventEmitter<D> = new EventEmitter<D>();

  /** Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[];

  /** Emits when the datepicker has been opened. */
  // tslint:disable-next-line:no-output-rename
  @Output('opened') openedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  // tslint:disable-next-line:no-output-rename
  @Output('closed') closedStream: EventEmitter<void> = new EventEmitter<void>();


  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { value ? this.open() : this.close(); }
  private _opened = false;

  /** The id for the datepicker calendar. */
  id = `sbb-datepicker-${datepickerUid++}`;

  /** The currently selected date. */
  get selected(): D | null { return this.validSelected; }
  set selected(value: D | null) { this.validSelected = value; }
  private validSelected: D | null = null;

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

  /** A reference to the overlay when the calendar is opened as a popup. */
  popupRef: OverlayRef;

  /** A portal containing the calendar for this datepicker. */
  private calendarPortal: ComponentPortal<DatepickerContentComponent<D>>;

  /** Reference to the component instantiated in popup mode. */
  private popupComponentRef: ComponentRef<DatepickerContentComponent<D>> | null;

  /** The element that was focused before the datepicker was opened. */
  private focusedElementBeforeOpen: HTMLElement | null = null;

  /** Subscription to value changes in the associated input element. */
  private inputSubscription = Subscription.EMPTY;

  /** The input element this datepicker is associated with. */
  datepickerInput: DatepickerInputDirective<D>;

  /** Emits when the datepicker is disabled. */
  readonly disabledChange = new Subject<boolean>();

  /** Emits new selected date when selected date changes. */
  readonly selectedChanged = new Subject<D>();

  constructor(private _overlay: Overlay,
    private ngZone: NgZone,
    private viewContainerRef: ViewContainerRef,
    @Inject(SBB_DATEPICKER_SCROLL_STRATEGY) private scrollStrategy,
    @Optional() private dateAdapter: DateAdapter<D>,
    @Optional() @Inject(DOCUMENT) private _document: any,
    @Inject(LOCALE_ID) public locale: string
  ) {
    if (!this.dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    this.dateAdapter.setLocale(locale);
  }

  ngOnDestroy() {
    this.close();
    this.inputSubscription.unsubscribe();
    this.disabledChange.complete();

    if (this.popupRef) {
      this.popupRef.dispose();
      this.popupComponentRef = null;
    }
  }

  /** Selects the given date */
  select(date: D): void {
    const oldValue = this.selected;
    this.selected = date;
    if (!this.dateAdapter.sameDate(oldValue, this.selected)) {
      this.selectedChanged.next(date);
    }
  }

  /** Emits the selected year in multiyear view */
  selectYear(normalizedYear: D): void {
    this.yearSelected.emit(normalizedYear);
  }

  /** Emits selected month in year view */
  selectMonth(normalizedMonth: D): void {
    this.monthSelected.emit(normalizedMonth);
  }

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  registerInput(input: DatepickerInputDirective<D>): void {
    if (this.datepickerInput) {
      throw Error('A MatDatepicker can only be associated with a single input.');
    }
    this.datepickerInput = input;
    this.inputSubscription =
      this.datepickerInput.valueChange.subscribe((value: D | null) => this.selected = value);
  }

  /** Open the calendar. */
  open(): void {
    if (this._opened || this.disabled) {
      return;
    }
    if (!this.datepickerInput) {
      throw Error('Attempted to open an MatDatepicker with no associated input.');
    }
    if (this._document) {
      this.focusedElementBeforeOpen = this._document.activeElement;
    }

    this.openAsPopup();
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
    if (this.calendarPortal && this.calendarPortal.isAttached) {
      this.calendarPortal.detach();
    }

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this._opened) {
        this._opened = false;
        this.closedStream.emit();
        this.focusedElementBeforeOpen = null;
      }
    };

    if (this.focusedElementBeforeOpen &&
      typeof this.focusedElementBeforeOpen.focus === 'function') {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      this.focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  /** Open the calendar as a popup. */
  private openAsPopup(): void {
    if (!this.calendarPortal) {
      this.calendarPortal = new ComponentPortal<DatepickerContentComponent<D>>(DatepickerContentComponent,
        this.viewContainerRef);
    }

    if (!this.popupRef) {
      this.createPopup();
    }

    if (!this.popupRef.hasAttached()) {
      this.popupComponentRef = this.popupRef.attach(this.calendarPortal);
      this.popupComponentRef.instance.datepicker = this;

      // Update the position once the calendar has rendered.
      this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this.popupRef.updatePosition();
      });
    }
  }

  /** Create the popup. */
  private createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this.createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'sbb-overlay-transparent-backdrop',
      scrollStrategy: this.scrollStrategy(),
      panelClass: 'sbb-datepicker-popup',
    });

    this.popupRef = this._overlay.create(overlayConfig);
    this.popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this.popupRef.backdropClick(),
      this.popupRef.detachments(),
      this.popupRef.keydownEvents().pipe(filter(event => {
        // Closing on alt + up is only valid when there's an input associated with the datepicker.
        return event.keyCode === ESCAPE ||
          (this.datepickerInput && event.altKey && event.keyCode === UP_ARROW);
      }))
    ).subscribe(() => this.close());
  }

  /** Create the popup PositionStrategy. */
  private createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
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
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private getValidDateOrNull(obj: any): D | null {
    return (this.dateAdapter.isDateInstance(obj) && this.dateAdapter.isValid(obj)) ? obj : null;
  }

}
