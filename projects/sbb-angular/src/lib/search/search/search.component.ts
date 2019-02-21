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
import { DOCUMENT } from '@angular/common';
import { filter, switchMap, delay, tap, map, first } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  ViewContainerRef,
  HostBinding,
  InjectionToken,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  Component,
  TemplateRef,
} from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subscription, defer, fromEvent, merge, of as observableOf, Subject, Observable } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { HighlightPipe } from '../../option/option/highlight.pipe';
import {
  SBBOptionSelectionChange,
  countGroupLabelsBeforeOption,
  getOptionScrollPosition,
  OptionComponent
} from '../../option/option/option.component';
import {
  AutocompleteComponent,
  AutocompleteOriginDirective,
  SBB_AUTOCOMPLETE_SCROLL_STRATEGY,
  AUTOCOMPLETE_OPTION_HEIGHT, AUTOCOMPLETE_PANEL_HEIGHT, getSbbAutocompleteMissingPanelError
} from '../../autocomplete/autocomplete';
import { AnimationBuilder, style, animate } from '@angular/animations';

/** Injection token that determines the scroll handling while the calendar is open. */
export const SBB_SEARCH_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('sbb-search-scroll-strategy');

/** @docs-private */
export function SBB_SEARCH_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_SEARCH_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_SEARCH_SCROLL_STRATEGY_FACTORY,
};

export class SearchChangeEvent {
  constructor(
    /** Instance of search field component. */
    public instance: SearchComponent,
    /** States if the search field has been opened by a click. */
    public isUserInput = false
  ) { }
}

let searchFieldCounter = 1;
const ANIMATION_DELAY = 300;

@Component({
  selector: 'sbb-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchComponent),
    multi: true
  }]
})
export class SearchComponent implements ControlValueAccessor, OnDestroy {

  /** @docs-private */
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  /** @docs-private */
  @ViewChild('button') button: ElementRef<HTMLButtonElement>;
  @ViewChild('searchbox') searchbox: ElementRef<HTMLElement>;

  @Input() mode: 'header' | 'default' = 'default';

  /** @docs-private */
  @ViewChild('searchbox') searchboxTemplate: TemplateRef<any>;

  /**
 * Identifier of search.
 */
  @HostBinding('attr.id')
  searchFieldId = 'sbb-search-id-' + searchFieldCounter++;

  /**
   * Identifier of search content.
   */
  contentId = 'sbb-search-content-id-' + searchFieldCounter;

  /**
   * Css class on search component.
   */
  @HostBinding('class.sbb-search') cssClass = true;

  private overlayRef: OverlayRef | null;
  private portal: TemplatePortal;
  private componentDestroyed = false;
  private _autocompleteDisabled = false;

  get hideSearch(): boolean {
    if (this.mode === 'default') {
      return false;
    }
    return this._hideSearch;
  }
  private _hideSearch = true;

  /** Old value of the native input. Used to work around issues with the `input` event on IE. */
  private previousValue: string | number | null;

  /** Strategy that is used to position the panel. */
  private positionStrategy: FlexibleConnectedPositionStrategy;

  /** Whether or not the label state is being overridden. */
  private manuallyFloatingLabel = false;

  /** The subscription for closing actions (some are bound to document). */
  private closingActionsSubscription: Subscription;
  private closingSearchActionsSubscription: Subscription;

  /** Subscription to viewport size changes. */
  private viewportSubscription = Subscription.EMPTY;
  private positionSubscription = Subscription.EMPTY;
  /**
   * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
   * closed autocomplete from being reopened if the user switches to another browser tab and then
   * comes back.
   */
  private canOpenOnNextFocus = true;

  /** Stream of keyboard events that can close the panel. */
  private readonly closeKeyEventStream = new Subject<void>();
  private readonly closeKeyEventSearchStream = new Subject<void>();

  private overlayAttached = false;
  private highlightPipe = new HighlightPipe();

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
  readonly optionSelections: Observable<SBBOptionSelectionChange> = defer<Observable<SBBOptionSelectionChange>>(() => {
    if (this.autocomplete && this.autocomplete.options) {
      return merge(...this.autocomplete.options.map(option => option.onSelectionChange));
    }

    // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
    // Return a stream that we'll replace with the real one once everything is in place.
    return this.zone.onStable
      .asObservable()
      .pipe(first(), switchMap(() => this.optionSelections));
  });


  onBlur($event) {
    this.onTouched();
    if (!!this.overlayRef && !this.overlayRef.overlayElement.contains($event.relatedTarget)) {

      if (($event.target === this.input.nativeElement && $event.relatedTarget !== this.button.nativeElement)
        || ($event.target === this.button.nativeElement && $event.relatedTarget !== this.input.nativeElement)) {
        this.closeKeyEventSearchStream.next();
      }
    }
  }


  onInput($event: KeyboardEvent) {
    this.handleInput($event);
  }

  onKeydown($event: KeyboardEvent) {
    this.handleKeydown($event);
  }

  @HostBinding('attr.aria-expanded') get ariaExpanded(): string {
    return this.autocompleteDisabled ? null : this.panelOpen.toString();
  }

  @HostBinding('attr.aria-owns') get ariaOwns(): string {
    return (this.autocompleteDisabled || !this.panelOpen) ? null : this.autocomplete.id;
  }

  /**
   * Event handler for when the window is blurred. Needs to be an
   * arrow function in order to preserve the context.
   */
  private windowBlurHandler = () => {
    // If the user blurred the window while the autocomplete is focused, it means that it'll be
    // refocused when they come back. In this case we want to skip the first focus event, if the
    // pane was closed, in order to avoid reopening it unintentionally.
    this.canOpenOnNextFocus =
      document.activeElement !== this.element.nativeElement || this.panelOpen;
  }

  /** `View -> model callback called when value changes` */
  onChange: (value: any) => void = () => { };

  /** `View -> model callback called when autocomplete has been touched` */
  onTouched = () => { };

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('sbbAutocompleteDisabled')
  get autocompleteDisabled(): boolean { return this._autocompleteDisabled; }
  set autocompleteDisabled(value: boolean) {
    this._autocompleteDisabled = coerceBooleanProperty(value);
  }

  @HostBinding('attr.aria-autocomplete')
  get ariaAutocomplete(): string { return this._autocompleteDisabled ? null : 'list'; }

  constructor(
    private element: ElementRef<HTMLInputElement>,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(SBB_AUTOCOMPLETE_SCROLL_STRATEGY) private scrollStrategy,
    @Optional() @Inject(DOCUMENT) private _document: any,
    private animationBuilder: AnimationBuilder,
    private viewportRuler?: ViewportRuler
  ) {

    if (typeof window !== 'undefined') {
      zone.runOutsideAngular(() => {
        window.addEventListener('blur', this.windowBlurHandler);
      });
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.windowBlurHandler);
    }

    this.viewportSubscription.unsubscribe();
    this.positionSubscription.unsubscribe();
    this.componentDestroyed = true;
    this.destroyPanel();
    this.closeKeyEventStream.complete();
  }

  /** Whether or not the autocomplete panel is open. */
  get panelOpen(): boolean {
    return this.overlayAttached && this.autocomplete.showPanel;
  }

  /** Opens the autocomplete suggestion panel. */
  openPanel(): void {
    this.attachOverlay();
  }

  /** Closes the autocomplete suggestion panel. */
  closePanel(): void {
    this.resetLabel();

    if (!this.overlayAttached) {
      return;
    }

    if (this.panelOpen) {
      // Only emit if the panel was visible.
      this.autocomplete.closed.emit();
    }

    this.autocomplete._isOpen = this.overlayAttached = false;

    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.closingActionsSubscription.unsubscribe();
    }

    // Note that in some cases this can end up being called after the component is destroyed.
    // Add a check to ensure that we don't try to run change detection on a destroyed view.
    if (!this.componentDestroyed) {
      // We need to trigger change detection manually, because
      // `fromEvent` doesn't seem to do it at the proper time.
      // This ensures that the label is reset when the
      // user clicks outside.
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * A stream of actions that should close the autocomplete panel, including
   * when an option is selected, on blur, and when TAB is pressed.
   */
  get panelClosingActions(): Observable<SBBOptionSelectionChange | null> {
    return merge(
      this.optionSelections,
      this.autocomplete.keyManager.tabOut.pipe(filter(() => this.overlayAttached)),
      this.closeKeyEventStream,
      this.getOutsideClickStream(),
      this.overlayRef ?
        this.overlayRef.detachments().pipe(filter(() => this.overlayAttached)) :
        observableOf()
    ).pipe(
      // Normalize the output so we return a consistent type.
      map(event => event instanceof SBBOptionSelectionChange ? event : null)
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
  private getOutsideClickStream(): Observable<any> {
    if (!this._document) {
      return observableOf(null);
    }

    return merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend')
    )
      .pipe(filter(event => {
        const clickTarget = event.target as HTMLElement;
        const formField = null;

        return this.overlayAttached &&
          clickTarget !== this.element.nativeElement &&
          clickTarget !== this.input.nativeElement &&
          (!formField || !formField.contains(clickTarget)) &&
          (!!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget));
      }));
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any): void {
    Promise.resolve(null).then(() => this.setTriggerValue(value));
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
    this.element.nativeElement.disabled = isDisabled;
  }

  handleKeydown(event: KeyboardEvent): void {
    // tslint:disable-next-line
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
      this.resetActiveItem();
      event.preventDefault();
    } else if (this.autocomplete) {
      const prevActiveItem = this.autocomplete.keyManager.activeItem;
      const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;
      if (this.panelOpen || keyCode === TAB) {
        this.autocomplete.keyManager.onKeydown(event);
      } else if (isArrowKey && this.canOpen()) {
        this.openPanel();

      }
      if (isArrowKey || this.autocomplete.keyManager.activeItem !== prevActiveItem) {
        this.scrollToOption();
      }
    }
    this.zone.onStable
      .asObservable()
      .pipe()
      .subscribe(() => this.highlightOptionsByInput(this.input.nativeElement.value));
  }

  scrollToOption(): void {
    const index = this.autocomplete.keyManager.activeItemIndex || 0;
    const labelCount = countGroupLabelsBeforeOption(index,
      this.autocomplete.options, this.autocomplete.optionGroups);

    const newScrollPosition = getOptionScrollPosition(
      index + labelCount,
      AUTOCOMPLETE_OPTION_HEIGHT,
      this.autocomplete.getScrollTop(),
      AUTOCOMPLETE_PANEL_HEIGHT
    );

    this.autocomplete.setScrollTop(newScrollPosition);
  }

  highlightOptionsByInput(value: number | string) {
    this.autocomplete.options
      .filter(option => !option.group)
      .forEach(option => {
        option.getHostElement().innerHTML = this.highlightPipe.transform(option.getHostElement().textContent, value);
      });
  }

  handleInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    let value: number | string | null = target.value;

    // Based on `NumberValueAccessor` from forms.
    if (target.type === 'number') {
      value = value === '' ? null : parseFloat(value);
    }
    this.highlightOptionsByInput(value);

    // If the input has a placeholder, IE will fire the `input` event on page load,
    // focus and blur, in addition to when the user actually changed the value. To
    // filter out all of the extra events, we save the value on focus and between
    // `input` events, and we check whether it changed.
    // See: https://connect.microsoft.com/IE/feedback/details/885747/
    if (this.previousValue !== value && document.activeElement === event.target) {
      this.previousValue = value;
      this.onChange(value);

      if (this.canOpen()) {
        this.openPanel();
      } else {
        this.closePanel();
      }

    }
  }

  handleFocus(): void {
    if (!this.canOpenOnNextFocus) {
      this.canOpenOnNextFocus = true;
    } else if (this.canOpen()) {
      this.previousValue = this.input.nativeElement.value;
      this.attachOverlay();
    }
  }

  /** If the label has been manually elevated, return it to its normal state. */
  private resetLabel(): void {
    if (this.manuallyFloatingLabel) {
      this.manuallyFloatingLabel = false;
    }
  }

  /**
 * This method listens to a stream of panel closing actions and resets the
 * stream every time the option list changes.
 */
  private subscribeToClosingActions(): Subscription {
    const firstStable = this.zone.onStable.asObservable().pipe(first());
    const optionChanges = this.autocomplete.options.changes.pipe(
      tap(() => this.positionStrategy.reapplyLastPosition()),
      // Defer emitting to the stream until the next tick, because changing
      // bindings in here will cause "changed after checked" errors.
      delay(0)
    );

    // When the zone is stable initially, and when the option list changes...
    return merge(firstStable, optionChanges)
      .pipe(
        // create a new stream of panelClosingActions, replacing any previous streams
        // that were created, and flatten it so our stream only emits closing events...
        switchMap(() => {
          this.resetActiveItem();
          this.autocomplete.setVisibility();

          if (this.panelOpen) {
            // tslint:disable-next-line:no-non-null-assertion
            this.overlayRef!.updatePosition();
          }

          return this.panelClosingActions;
        }),
        // when the first closing event occurs...
        first()
      )
      // set the value, close the panel, and complete.
      .subscribe(event => {
        this.setValueAndClose(event);
      });
  }

  /** Destroys the autocomplete suggestion panel. */
  private destroyPanel(): void {
    if (this.overlayRef) {
      this.closePanel();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private setTriggerValue(value: any): void {
    const toDisplay = this.autocomplete && this.autocomplete.displayWith ?
      this.autocomplete.displayWith(value) :
      value;

    // Simply falling back to an empty string if the display value is falsy does not work properly.
    // The display value can also be the number zero and shouldn't fall back to an empty string.
    const inputValue = toDisplay != null ? toDisplay : '';

    // If it's used within a `SbbField`, we should set it through the property so it can go
    // through change detection.
    if (this.input) {
      this.input.nativeElement.value = inputValue;
      this.previousValue = inputValue;
    }
  }

  /**
   * This method closes the panel, and if a value is specified, also sets the associated
   * control to that value. It will also mark the control as dirty if this interaction
   * stemmed from the user.
   */
  private setValueAndClose(event: SBBOptionSelectionChange | null): void {
    if (event && event.source) {
      this.clearPreviousSelectedOption(event.source);
      this.setTriggerValue(event.source.value);
      this.onChange(event.source.value);
      this.input.nativeElement.focus();
      this.autocomplete.emitSelectEvent(event.source);
    }

    this.closePanel();
  }

  /**
   * Clear any previous selected option and emit a selection change event for this option
   */
  private clearPreviousSelectedOption(skip: OptionComponent) {
    this.autocomplete.options.forEach(option => {
      // tslint:disable-next-line:triple-equals
      if (option != skip && option.selected) {
        option.deselect();
      }
    });
  }

  private attachOverlay(): void {
    if (!this.autocomplete) {
      throw getSbbAutocompleteMissingPanelError();
    }
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(this.autocomplete.template, this.viewContainerRef);
      this.overlayRef = this.overlay.create(this.getOverlayConfig());

      if (this.positionStrategy) {
        this.positionSubscription = this.positionStrategy.positionChanges.subscribe(position => {
          if (this.autocomplete.panel) {
            if (position.connectionPair.originY === 'top') {
              this.autocomplete.panel.nativeElement.classList.add('sbb-autocomplete-panel-above');
              this.getConnectedElement().nativeElement.classList.add('sbb-autocomplete-input-above');
            } else {
              this.autocomplete.panel.nativeElement.classList.remove('sbb-autocomplete-panel-above');
              this.getConnectedElement().nativeElement.classList.remove('sbb-autocomplete-input-above');
            }
          }

        });
      }

      // Use the `keydownEvents` in order to take advantage of
      // the overlay event targeting provided by the CDK overlay.
      this.overlayRef.keydownEvents().subscribe(event => {
        // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
        // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
        // tslint:disable-next-line
        if (event.keyCode === ESCAPE || (event.keyCode === UP_ARROW && event.altKey)) {
          this.resetActiveItem();
          this.closeKeyEventStream.next();
          this.closeKeyEventSearchStream.next();
        }
      });

      if (this.viewportRuler) {
        this.viewportSubscription = this.viewportRuler.change().subscribe(() => {
          if (this.panelOpen && this.overlayRef) {
            this.overlayRef.updateSize({ width: this.getPanelWidth() });
          }
        });
      }
    } else {
      // Update the panel width and direction, in case anything has changed.
      this.overlayRef.updateSize({ width: this.getPanelWidth() });
    }

    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
      this.closingActionsSubscription = this.subscribeToClosingActions();
    }

    const wasOpen = this.panelOpen;

    this.autocomplete.setVisibility();
    this.autocomplete._isOpen = this.overlayAttached = true;

    // We need to do an extra `panelOpen` check in here, because the
    // autocomplete won't be shown if there are no options.
    if (this.panelOpen && wasOpen !== this.panelOpen) {
      this.autocomplete.opened.emit();
      if (this.mode === 'header') {
  
      }


    }
  }

  private openAnimation(element: HTMLElement) {
    const myAnimation = this.animationBuilder.build([
      style({ width: 0, opacity: 0, display: 'none' }),
      animate(ANIMATION_DELAY, style({ width: this.getPanelWidth(), opacity: 1, display: 'flex' }))
    ]);

    // use the returned factory object to create a player
    const player = myAnimation.create(element);
    player.play();
    return player;
  }

  private closeAnimation(element: HTMLElement) {
    const myAnimation = this.animationBuilder.build([
      style({ width: this.getPanelWidth(), opacity: 1, display: 'flex' }),
      animate(ANIMATION_DELAY, style({ width: 0, opacity: 0, display: 'none' }))
    ]);

    // use the returned factory object to create a player
    const player = myAnimation.create(element);
    player.play();
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.getOverlayPosition(),
      scrollStrategy: this.scrollStrategy(),
      width: this.getPanelWidth(),
      panelClass: 'sbb-search-panel'
    });
  }

  private getOverlayPosition(): PositionStrategy {
    this.positionStrategy = this.overlay.position()
      // .flexibleConnectedTo(this.mode === 'default' ? this.getConnectedElement() : this.headerOverlayRef.overlayElement)
      .flexibleConnectedTo(this.getConnectedElement())
      .withFlexibleDimensions(false)
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

    return this.positionStrategy;
  }

  private getConnectedElement(): ElementRef {
    if (this.connectedTo) {
      return this.connectedTo.elementRef;
    }

    return this.element;
  }

  private getPanelWidth(): number | string {
    return this.autocomplete.panelWidth || this.getHostWidth();
  }

  /** Returns the width of the input element, so the panel width can match it. */
  private getHostWidth(): number {
    return this.getConnectedElement().nativeElement.getBoundingClientRect().width;
  }

  /**
   * Resets the active item to -1 so arrow events will activate the
   * correct options, or to 0 if the consumer opted into it.
   */
  private resetActiveItem(): void {
    this.autocomplete.keyManager.setActiveItem(this.autocomplete.autoActiveFirstOption ? 0 : -1);
  }

  /** Determines whether the panel can be opened. */
  private canOpen(): boolean {
    const element = this.input.nativeElement;
    return !element.readOnly &&
      !element.disabled &&
      !this.autocompleteDisabled;
  }

  revealSearchbox() {
    this._hideSearch = false;
    this.closingSearchActionsSubscription = this.subscribeToSearchClosingActions();
  }

  get searchClosingActions(): Observable<any> {
    return merge(
      this.closeKeyEventSearchStream,
      this.getOutsideClickStream(),

    ).pipe(
      // Normalize the output so we return a consistent type.
      map(event => event)
    );
  }


  /**
  * This method listens to a stream of panel closing actions and resets the
  * stream every time the option list changes.
  */
  private subscribeToSearchClosingActions(): Subscription {
    const firstStable = this.zone.onStable.asObservable().pipe(first());

    // When the zone is stable initially, and when the option list changes...
    return merge(firstStable)
      .pipe(
        // create a new stream of panelClosingActions, replacing any previous streams
        // that were created, and flatten it so our stream only emits closing events...
        switchMap(() => {
          if (this.mode === 'header') {
            return this.searchClosingActions;
          }
        }),
        // when the first closing event occurs...
        first(),
        tap(() => {
          this.closeAnimation(this.autocomplete.panel.nativeElement);
          this.closeAnimation(this.searchbox.nativeElement);
        }),
        delay(ANIMATION_DELAY)
      )
      // set the value, close the panel, and complete.
      .subscribe(event => {
        this._hideSearch = true;
        this.changeDetectorRef.markForCheck();
      });
  }

}
