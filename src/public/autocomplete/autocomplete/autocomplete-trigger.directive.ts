import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  countGroupLabelsBeforeOption,
  getOptionScrollPosition,
  OptionComponent,
  SBBOptionSelectionChange
} from '@sbb-esta/angular-public/option';
import {
  defer,
  fromEvent,
  merge,
  Observable,
  of as observableOf,
  Subject,
  Subscription
} from 'rxjs';
import { delay, filter, first, map, switchMap, tap } from 'rxjs/operators';

import { AutocompleteOriginDirective } from './autocomplete-origin.directive';
import { AutocompleteComponent } from './autocomplete.component';

/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * @docs-private
 */
export function getSbbAutocompleteMissingPanelError(): Error {
  return Error(
    'Attempting to open an undefined instance of `sbb-autocomplete`. ' +
      'Make sure that the id passed to the `sbbAutocomplete` is correct and that ' +
      `you're attempting to open it after the ngAfterContentInit hook.`
  );
}

/** Injection token that determines the scroll handling while the autocomplete panel is open. */
export const SBB_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-autocomplete-scroll-strategy'
);

/** @docs-private */
export function SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** The height of each autocomplete option. */
export const AUTOCOMPLETE_OPTION_HEIGHT = 40;

/** The total height of the autocomplete panel. */
export const AUTOCOMPLETE_PANEL_HEIGHT = 404;

export const SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_AUTOCOMPLETE_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY
};

@Directive({
  selector: `input[sbbAutocomplete]`,
  exportAs: 'sbbAutocompleteTrigger',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteTriggerDirective),
      multi: true
    }
  ]
})
export class AutocompleteTriggerDirective implements ControlValueAccessor, OnDestroy {
  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal;
  private _document: Document;
  private _componentDestroyed = false;
  private _autocompleteDisabled = false;

  /** Old value of the native input. Used to work around issues with the `input` event on IE. */
  private _previousValue: string | number | null;

  /** Strategy that is used to position the panel. */
  private _positionStrategy: FlexibleConnectedPositionStrategy;

  /** Whether or not the label state is being overridden. */
  private _manuallyFloatingLabel = false;

  /** The subscription for closing actions (some are bound to document). */
  private _closingActionsSubscription: Subscription;

  /** Subscription to viewport size changes. */
  private _viewportSubscription = Subscription.EMPTY;
  private _positionSubscription = Subscription.EMPTY;
  /**
   * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
   * closed autocomplete from being reopened if the user switches to another browser tab and then
   * comes back.
   */
  private _canOpenOnNextFocus = true;

  /** Stream of keyboard events that can close the panel. */
  private readonly _closeKeyEventStream = new Subject<void>();
  private _overlayAttached = false;

  @HostBinding('attr.role') get role() {
    return this._autocompleteDisabled ? null : 'combobox';
  }

  /** The autocomplete panel to be attached to this trigger. */
  // tslint:disable-next-line:no-input-rename
  @Input('sbbAutocomplete') autocomplete: AutocompleteComponent;

  /**
   * Reference relative to which to position the autocomplete panel.
   * Defaults to the autocomplete trigger element.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('sbbAutocompleteConnectedTo') connectedTo: AutocompleteOriginDirective;

  /**
   * `autocomplete` attribute to be set on the input element.
   * @docs-private
   */
  // tslint:disable-next-line:no-input-rename
  @Input('autocomplete')
  @HostBinding('attr.autocomplete')
  autocompleteAttribute = 'off';

  /** Stream of autocomplete option selections. */
  readonly optionSelections: Observable<SBBOptionSelectionChange> = defer(() => {
    if (this.autocomplete && this.autocomplete.options) {
      return merge<SBBOptionSelectionChange>(
        ...this.autocomplete.options.map(option => option.onSelectionChange)
      );
    }

    // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
    // Return a stream that we'll replace with the real one once everything is in place.
    return this._zone.onStable.asObservable().pipe(
      first(),
      switchMap(() => this.optionSelections)
    );
  });

  @HostBinding('attr.aria-expanded') get ariaExpanded(): string | null {
    return this.autocompleteDisabled ? null : this.panelOpen.toString();
  }

  @HostBinding('attr.aria-owns') get ariaOwns(): string | null {
    return this.autocompleteDisabled || !this.panelOpen ? null : this.autocomplete.id;
  }

  /**
   * Event handler for when the window is blurred. Needs to be an
   * arrow function in order to preserve the context.
   */
  private _windowBlurHandler = () => {
    // If the user blurred the window while the autocomplete is focused, it means that it'll be
    // refocused when they come back. In this case we want to skip the first focus event, if the
    // pane was closed, in order to avoid reopening it unintentionally.
    this._canOpenOnNextFocus =
      this._document.activeElement !== this._elementRef.nativeElement || this.panelOpen;
  };

  /** `View -> model callback called when value changes` */
  onChange: (value: any) => void = () => {};

  /** `View -> model callback called when autocomplete has been touched` */
  @HostListener('blur')
  onTouched = () => {};

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('sbbAutocompleteDisabled')
  get autocompleteDisabled(): boolean {
    return this._autocompleteDisabled;
  }
  set autocompleteDisabled(value: boolean) {
    this._autocompleteDisabled = coerceBooleanProperty(value);
  }

  @HostBinding('attr.aria-autocomplete')
  get ariaAutocomplete(): string | null {
    return this._autocompleteDisabled ? null : 'list';
  }

  constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _zone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(SBB_AUTOCOMPLETE_SCROLL_STRATEGY) private _scrollStrategy: any,
    private _viewportRuler: ViewportRuler,
    @Optional() @Inject(DOCUMENT) document: any
  ) {
    this._document = document;
    if (typeof window !== 'undefined') {
      _zone.runOutsideAngular(() => {
        window.addEventListener('blur', this._windowBlurHandler);
      });
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this._windowBlurHandler);
    }

    this._viewportSubscription.unsubscribe();
    this._positionSubscription.unsubscribe();
    this._componentDestroyed = true;
    this._destroyPanel();
    this._closeKeyEventStream.complete();
  }

  /** Whether or not the autocomplete panel is open. */
  get panelOpen(): boolean {
    return this._overlayAttached && this.autocomplete.showPanel;
  }

  /** Opens the autocomplete suggestion panel. */
  openPanel(): void {
    this._attachOverlay();
  }

  /** Closes the autocomplete suggestion panel. */
  closePanel(): void {
    this._resetLabel();

    if (!this._overlayAttached) {
      return;
    }

    if (this.panelOpen) {
      // Only emit if the panel was visible.
      this.autocomplete.closed.emit();
    }

    this.autocomplete._isOpen = this._overlayAttached = false;

    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
      this._closingActionsSubscription.unsubscribe();
    }

    // Note that in some cases this can end up being called after the component is destroyed.
    // Add a check to ensure that we don't try to run change detection on a destroyed view.
    if (!this._componentDestroyed) {
      // We need to trigger change detection manually, because
      // `fromEvent` doesn't seem to do it at the proper time.
      // This ensures that the label is reset when the
      // user clicks outside.
      this._changeDetectorRef.detectChanges();
    }
  }

  /**
   * A stream of actions that should close the autocomplete panel, including
   * when an option is selected, on blur, and when TAB is pressed.
   */
  get panelClosingActions(): Observable<SBBOptionSelectionChange | null> {
    return merge(
      this.optionSelections,
      this.autocomplete.keyManager.tabOut.pipe(filter(() => this._overlayAttached)),
      this._closeKeyEventStream,
      this._getOutsideClickStream(),
      this._overlayRef
        ? this._overlayRef.detachments().pipe(filter(() => this._overlayAttached))
        : observableOf()
    ).pipe(
      // Normalize the output so we return a consistent type.
      map(event => (event instanceof SBBOptionSelectionChange ? event : null))
    );
  }

  @HostBinding('attr.aria-activedescendant') get activeOptionId() {
    return this.activeOption ? this.activeOption.id : null;
  }

  /** The currently active option, coerced to SbbOption type. */
  get activeOption(): OptionComponent | null {
    if (this.autocomplete && this.autocomplete.keyManager) {
      return this.autocomplete.keyManager.activeItem;
    }

    return null;
  }

  /** Stream of clicks outside of the autocomplete panel. */
  private _getOutsideClickStream(): Observable<any> {
    if (!this._document) {
      return observableOf(null);
    }

    return merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend')
    ).pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;

        return (
          this._overlayAttached &&
          clickTarget !== this._elementRef.nativeElement &&
          !!this._overlayRef &&
          !this._overlayRef.overlayElement.contains(clickTarget)
        );
      })
    );
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any): void {
    Promise.resolve(null).then(() => this._setTriggerValue(value));
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => {}): void {
    this.onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => {}) {
    this.onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean) {
    this._elementRef.nativeElement.disabled = isDisabled;
  }

  /** @docs-private */
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;

    // Prevent the default action on all escape key presses. This is here primarily to bring IE
    // in line with other browsers. By default, pressing escape on IE will cause it to revert
    // the input value to the one that it had on focus, however it won't dispatch any events
    // which means that the model value will be out of sync with the view.
    if (keyCode === ESCAPE) {
      event.preventDefault();
    }

    if (this.activeOption && keyCode === ENTER && this.panelOpen) {
      this.activeOption.selectViaInteraction();
      this._resetActiveItem();
      event.preventDefault();
    } else if (this.autocomplete) {
      const prevActiveItem = this.autocomplete.keyManager.activeItem;
      const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;
      if (this.panelOpen || keyCode === TAB) {
        this.autocomplete.keyManager.onKeydown(event);
      } else if (isArrowKey && this._canOpen()) {
        this.openPanel();
      }
      if (isArrowKey || this.autocomplete.keyManager.activeItem !== prevActiveItem) {
        this.scrollToOption();
      }
    }
    this.highlightOptionsByInput(this._elementRef.nativeElement.value);
  }

  scrollToOption(): void {
    const index = this.autocomplete.keyManager.activeItemIndex || 0;
    const labelCount = countGroupLabelsBeforeOption(
      index,
      this.autocomplete.options,
      this.autocomplete.optionGroups
    );

    const newScrollPosition = getOptionScrollPosition(
      index + labelCount,
      AUTOCOMPLETE_OPTION_HEIGHT,
      this.autocomplete.getScrollTop(),
      AUTOCOMPLETE_PANEL_HEIGHT
    );

    this.autocomplete.setScrollTop(newScrollPosition);
  }

  highlightOptionsByInput(value: string) {
    if (!this.autocomplete) {
      return;
    }

    this._zone.onStable
      .asObservable()
      .pipe(first())
      .subscribe(() => {
        this.autocomplete.options
          .filter(option => !option.group)
          .forEach(option => option._highlight(value));
      });
  }

  /** @docs-private */
  @HostListener('input', ['$event'])
  handleInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    let value: number | string | null = target.value;

    // Based on `NumberValueAccessor` from forms.
    if (target.type === 'number') {
      value = value === '' ? null : parseFloat(value);
    }

    // If the input has a placeholder, IE will fire the `input` event on page load,
    // focus and blur, in addition to when the user actually changed the value. To
    // filter out all of the extra events, we save the value on focus and between
    // `input` events, and we check whether it changed.
    // See: https://connect.microsoft.com/IE/feedback/details/885747/
    if (this._previousValue !== value && document.activeElement === event.target) {
      this._previousValue = value;
      this.onChange(value);
      this.highlightOptionsByInput(target.value);

      if (this._canOpen()) {
        this.openPanel();
      } else {
        this.closePanel();
      }
    }
  }

  @HostListener('focusin')
  handleFocus(): void {
    if (!this._canOpenOnNextFocus) {
      this._canOpenOnNextFocus = true;
    } else if (this._canOpen()) {
      this._previousValue = this._elementRef.nativeElement.value;
      this._attachOverlay();
    }
  }

  /** If the label has been manually elevated, return it to its normal state. */
  private _resetLabel(): void {
    if (this._manuallyFloatingLabel) {
      this._manuallyFloatingLabel = false;
    }
  }

  /**
   * This method listens to a stream of panel closing actions and resets the
   * stream every time the option list changes.
   */
  private _subscribeToClosingActions(): Subscription {
    const firstStable = this._zone.onStable.asObservable().pipe(first());
    const optionChanges = this.autocomplete.options.changes.pipe(
      tap(() => this._positionStrategy.reapplyLastPosition()),
      // Defer emitting to the stream until the next tick, because changing
      // bindings in here will cause "changed after checked" errors.
      delay(0)
    );

    // When the zone is stable initially, and when the option list changes...
    return (
      merge(firstStable, optionChanges)
        .pipe(
          // create a new stream of panelClosingActions, replacing any previous streams
          // that were created, and flatten it so our stream only emits closing events...
          switchMap(() => {
            this._resetActiveItem();
            this.autocomplete.setVisibility();

            if (this.panelOpen) {
              // tslint:disable-next-line:no-non-null-assertion
              this._overlayRef!.updatePosition();
            }

            return this.panelClosingActions;
          }),
          // when the first closing event occurs...
          first()
        )
        // set the value, close the panel, and complete.
        .subscribe(event => this._setValueAndClose(event))
    );
  }

  /** Destroys the autocomplete suggestion panel. */
  private _destroyPanel(): void {
    if (this._overlayRef) {
      this.closePanel();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _setTriggerValue(value: any): void {
    const toDisplay =
      this.autocomplete && this.autocomplete.displayWith
        ? this.autocomplete.displayWith(value)
        : value;

    // Simply falling back to an empty string if the display value is falsy does not work properly.
    // The display value can also be the number zero and shouldn't fall back to an empty string.
    const inputValue = toDisplay != null ? toDisplay : '';

    // If it's used within a `SbbField`, we should set it through the property so it can go
    // through change detection.
    this._elementRef.nativeElement.value = inputValue;
    this._previousValue = inputValue;
  }

  /**
   * This method closes the panel, and if a value is specified, also sets the associated
   * control to that value. It will also mark the control as dirty if this interaction
   * stemmed from the user.
   */
  private _setValueAndClose(event: SBBOptionSelectionChange | null): void {
    if (event && event.source) {
      this._clearPreviousSelectedOption(event.source);
      this._setTriggerValue(event.source.value);
      this.onChange(event.source.value);
      this._elementRef.nativeElement.focus();
      this.autocomplete.emitSelectEvent(event.source);
    }

    this.closePanel();
  }

  /**
   * Clear any previous selected option and emit a selection change event for this option
   */
  private _clearPreviousSelectedOption(skip: OptionComponent) {
    this.autocomplete.options.forEach(option => {
      // tslint:disable-next-line:triple-equals
      if (option != skip && option.selected) {
        option.deselect();
      }
    });
  }

  private _attachOverlay(): void {
    if (!this.autocomplete) {
      throw getSbbAutocompleteMissingPanelError();
    }
    if (!this._overlayRef) {
      this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef);
      this._overlayRef = this._overlay.create(this._getOverlayConfig());

      if (this._positionStrategy) {
        this._positionSubscription = this._positionStrategy.positionChanges.subscribe(position => {
          if (this.autocomplete.panel) {
            if (position.connectionPair.originY === 'top') {
              this.autocomplete.panel.nativeElement.classList.add('sbb-autocomplete-panel-above');
              this._getConnectedElement().nativeElement.classList.add(
                'sbb-autocomplete-input-above'
              );
            } else {
              this.autocomplete.panel.nativeElement.classList.remove(
                'sbb-autocomplete-panel-above'
              );
              this._getConnectedElement().nativeElement.classList.remove(
                'sbb-autocomplete-input-above'
              );
            }
          }
        });
      }

      // Use the `keydownEvents` in order to take advantage of
      // the overlay event targeting provided by the CDK overlay.
      this._overlayRef.keydownEvents().subscribe(event => {
        // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
        // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
        if (event.keyCode === ESCAPE || (event.keyCode === UP_ARROW && event.altKey)) {
          this._resetActiveItem();
          this._closeKeyEventStream.next();
        }
      });

      if (this._viewportRuler) {
        this._viewportSubscription = this._viewportRuler.change().subscribe(() => {
          if (this.panelOpen && this._overlayRef) {
            this._overlayRef.updateSize({ width: this._getPanelWidth() });
          }
        });
      }
    } else {
      // Update the panel width and direction, in case anything has changed.
      this._overlayRef.updateSize({ width: this._getPanelWidth() });
    }

    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);
      this._closingActionsSubscription = this._subscribeToClosingActions();
    }

    const wasOpen = this.panelOpen;

    this.autocomplete.setVisibility();
    this.autocomplete._isOpen = this._overlayAttached = true;

    // We need to do an extra `panelOpen` check in here, because the
    // autocomplete won't be shown if there are no options.
    if (this.panelOpen && wasOpen !== this.panelOpen) {
      this.autocomplete.opened.emit();
    }
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPosition(),
      scrollStrategy: this._scrollStrategy(),
      width: this._getPanelWidth(),
      panelClass: 'sbb-overlay-panel',
      minHeight: 30
    });
  }

  private _getOverlayPosition(): PositionStrategy {
    this._positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._getConnectedElement())
      .withFlexibleDimensions(true)
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
        }
      ]);

    return this._positionStrategy;
  }

  private _getConnectedElement(): ElementRef {
    return this.connectedTo ? this.connectedTo.elementRef : this._elementRef;
  }

  private _getPanelWidth(): number | string {
    return this.autocomplete.panelWidth || this._getHostWidth();
  }

  /** Returns the width of the input element, so the panel width can match it. */
  private _getHostWidth(): number {
    return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
  }

  /**
   * Resets the active item to -1 so arrow events will activate the
   * correct options, or to 0 if the consumer opted into it.
   */
  private _resetActiveItem(): void {
    this.autocomplete.keyManager.setActiveItem(this.autocomplete.autoActiveFirstOption ? 0 : -1);
  }

  /** Determines whether the panel can be opened. */
  private _canOpen(): boolean {
    const element = this._elementRef.nativeElement;
    return !element.readOnly && !element.disabled && !this.autocompleteDisabled;
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_autocompleteDisabled: BooleanInput;
  // tslint:enable: member-ordering
}
