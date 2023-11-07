import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  SbbOptgroup,
  SbbOption,
  SbbOptionHint,
  SBB_OPTION_PARENT_COMPONENT,
} from '@sbb-esta/angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextId = 0;

/** Event object that is emitted when an autocomplete option is selected. */
export class SbbAutocompleteSelectedEvent {
  constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    public source: SbbAutocomplete,
    /** Option that was selected. */
    public option: SbbOption,
  ) {}
}

/** Event object that is emitted when an autocomplete option is activated. */
export interface SbbAutocompleteActivatedEvent {
  /** Reference to the autocomplete panel that emitted the event. */
  source: SbbAutocomplete;
  /** Option that was selected. */
  option: SbbOption | null;
}

/** Default `sbb-autocomplete` options that can be overridden. */
export interface SbbAutocompleteDefaultOptions {
  /** Whether the first option should be highlighted when an autocomplete panel is opened. */
  autoActiveFirstOption?: boolean;

  /** Whether the active option should be selected as the user is navigating. */
  autoSelectActiveOption?: boolean;

  /** Whether the user is required to make a selection when they're interacting with the autocomplete. */
  requireSelection?: boolean;

  /** Class or list of classes to be applied to the autocomplete's overlay panel. */
  overlayPanelClass?: string | string[];
}

/** Injection token to be used to override the default options for `sbb-autocomplete`. */
export const SBB_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken<SbbAutocompleteDefaultOptions>(
  'sbb-autocomplete-default-options',
  {
    providedIn: 'root',
    factory: SBB_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
  },
);

/** @docs-private */
export function SBB_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY(): SbbAutocompleteDefaultOptions {
  return { autoActiveFirstOption: false, autoSelectActiveOption: false, requireSelection: false };
}

@Component({
  selector: 'sbb-autocomplete',
  exportAs: 'sbbAutocomplete',
  templateUrl: 'autocomplete.html',
  styleUrls: ['autocomplete.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SBB_OPTION_PARENT_COMPONENT,
      useExisting: SbbAutocomplete,
    },
  ],
  host: {
    class: 'sbb-autocomplete',
  },
})
export class SbbAutocomplete implements AfterContentInit, OnDestroy {
  private _activeOptionChanges = Subscription.EMPTY;

  /** Class to apply to the panel when it's visible. */
  private _visibleClass: string = 'sbb-autocomplete-visible';

  /** Class to apply to the panel when it's hidden. */
  private _hiddenClass: string = 'sbb-autocomplete-hidden';

  /** Manages active item in option list based on key events. */
  _keyManager: ActiveDescendantKeyManager<SbbOption>;

  /** Whether the autocomplete panel should be visible, depending on option length. */
  get showPanel(): boolean {
    return this._showPanel.value;
  }
  _showPanel: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** Whether the autocomplete panel is open. */
  get isOpen(): boolean {
    return this._isOpen && this.showPanel;
  }
  _isOpen: boolean = false;

  // The @ViewChild query for TemplateRef here needs to be static because some code paths
  // lead to the overlay being created before change detection has finished for this component.
  // Notably, another component may trigger `focus` on the autocomplete-trigger.

  /** @docs-private */
  @ViewChild(TemplateRef, { static: true }) template: TemplateRef<any>;

  /** Element for the panel containing the autocomplete options. */
  @ViewChild('panel') panel: ElementRef;

  /** All of the defined select options. */
  @ContentChildren(SbbOption, { descendants: true }) options: QueryList<SbbOption>;

  /** All of the defined groups of options. */
  @ContentChildren(SbbOptgroup, { descendants: true }) optionGroups: QueryList<SbbOptgroup>;

  /** All of the defined option hints. */
  @ContentChildren(SbbOptionHint, { descendants: true })
  hints: QueryList<SbbOptionHint>;

  /** Aria label of the autocomplete. If not specified, the placeholder will be used as label. */
  @Input('aria-label') ariaLabel: string;

  /** Input that can be used to specify the `aria-labelledby` attribute. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** Function that maps an option's control value to its display value in the trigger. */
  @Input() displayWith: ((value: any) => string) | null = null;

  /**
   * Function which normalizes input values to highlight them in options.
   * E.g. If your function is <code>(value: string) => value.replace(new RegExp('[ö]', 'i'), 'o')</code>
   * and you search for 'Faroer', an option like 'Faröer' will be highlighted.
   * IMPORTANT: The provided function MAY NOT change the order of the characters or the length of the string.
   * (e.g. changing `ä` to `ae` would break the highlighting function)
   */
  @Input() localeNormalizer: ((value: string) => string) | null = null;

  /**
   * Whether the first option should be highlighted when the autocomplete panel is opened.
   * Can be configured globally through the `SBB_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
   */
  @Input()
  get autoActiveFirstOption(): boolean {
    return this._autoActiveFirstOption;
  }
  set autoActiveFirstOption(value: BooleanInput) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }
  private _autoActiveFirstOption: boolean;

  /** Whether the active option should be selected as the user is navigating. */
  @Input()
  get autoSelectActiveOption(): boolean {
    return this._autoSelectActiveOption;
  }
  set autoSelectActiveOption(value: BooleanInput) {
    this._autoSelectActiveOption = coerceBooleanProperty(value);
  }
  private _autoSelectActiveOption: boolean;

  /**
   * Whether the user is required to make a selection when they're interacting with the
   * autocomplete. If the user moves away from the autocomplete without selecting an option from
   * the list, the value will be reset. If the user opens the panel and closes it without
   * interacting or selecting a value, the initial value will be kept.
   */
  @Input()
  get requireSelection(): boolean {
    return this._requireSelection;
  }
  set requireSelection(value: BooleanInput) {
    this._requireSelection = coerceBooleanProperty(value);
  }
  private _requireSelection: boolean;

  /**
   * Specify the width of the autocomplete panel.  Can be any CSS sizing value, otherwise it will
   * match the width of its host.
   */
  @Input() panelWidth: string | number;

  /** Event that is emitted whenever an option from the list is selected. */
  @Output()
  readonly optionSelected: EventEmitter<SbbAutocompleteSelectedEvent> =
    new EventEmitter<SbbAutocompleteSelectedEvent>();

  /** Event that is emitted when the autocomplete panel is opened. */
  @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();

  /** Emits whenever an option is activated. */
  @Output()
  readonly optionActivated: EventEmitter<SbbAutocompleteActivatedEvent> =
    new EventEmitter<SbbAutocompleteActivatedEvent>();

  /**
   * Takes classes set on the host sbb-autocomplete element and applies them to the panel
   * inside the overlay container to allow for easy styling.
   */
  @Input('class')
  set classList(value: string | string[]) {
    if (value && value.length) {
      this._classList = coerceStringArray(value).reduce(
        (classList, className) => {
          classList[className] = true;
          return classList;
        },
        {} as { [key: string]: boolean },
      );
    } else {
      this._classList = {};
    }

    this._setVisibilityClasses(this._classList);
    this._elementRef.nativeElement.className = '';
  }
  _classList: { [key: string]: boolean } = {};

  /** If set to true, the panel is also displayed if there are no options but hints. */
  @Input()
  get showHintIfNoOptions(): boolean {
    return this._showHintIfNoOptions;
  }
  set showHintIfNoOptions(value: BooleanInput) {
    this._showHintIfNoOptions = coerceBooleanProperty(value);
  }
  private _showHintIfNoOptions: boolean = false;

  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  id: string = `sbb-autocomplete-${nextId++}`;

  /**
   * Tells any descendant `sbb-optgroup` to use the inert a11y pattern.
   * @docs-private
   */
  readonly inertGroups: boolean;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(SBB_AUTOCOMPLETE_DEFAULT_OPTIONS) defaults: SbbAutocompleteDefaultOptions,
    platform?: Platform,
  ) {
    // TODO(crisbeto): the problem that the `inertGroups` option resolves is only present on
    // Safari using VoiceOver. We should occasionally check back to see whether the bug
    // wasn't resolved in VoiceOver, and if it has, we can remove this and the `inertGroups`
    // option altogether.
    this.inertGroups = platform?.SAFARI || false;
    this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
    this._autoSelectActiveOption = !!defaults.autoSelectActiveOption;
    this._requireSelection = !!defaults.requireSelection;
  }

  ngAfterContentInit() {
    this._keyManager = new ActiveDescendantKeyManager<SbbOption>(this.options).withWrap();
    this._activeOptionChanges = this._keyManager.change.subscribe((index) => {
      if (this.isOpen) {
        this.optionActivated.emit({ source: this, option: this.options.toArray()[index] || null });
      }
    });

    // Set the initial visibility state.
    this._setVisibility();
  }

  ngOnDestroy() {
    this._activeOptionChanges.unsubscribe();
    this._keyManager?.destroy();
  }

  /**
   * Sets the panel scrollTop. This allows us to manually scroll to display options
   * above or below the fold, as they are not actually being focused when active.
   */
  _setScrollTop(scrollTop: number): void {
    if (this.panel) {
      this.panel.nativeElement.scrollTop = scrollTop;
    }
  }

  /** Returns the panel's scrollTop. */
  _getScrollTop(): number {
    return this.panel ? this.panel.nativeElement.scrollTop : 0;
  }

  /**
   * Panel should hide itself when the option list is empty.
   * If there are only hints and showHintIfNoOptions is true,
   * the panel should still be displayed.
   */
  _setVisibility() {
    this._showPanel.next(
      !!this.options.length || (!!this.hints.length && this.showHintIfNoOptions),
    );
    this._setVisibilityClasses(this._classList);
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the `select` event. */
  _emitSelectEvent(option: SbbOption): void {
    const event = new SbbAutocompleteSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }

  /** Gets the aria-labelledby for the autocomplete panel. */
  _getPanelAriaLabelledby(labelId: string | null): string | null {
    if (this.ariaLabel) {
      return null;
    }

    const labelExpression = labelId ? labelId + ' ' : '';
    return this.ariaLabelledby ? labelExpression + this.ariaLabelledby : labelId;
  }

  /** Sets the autocomplete visibility classes on a classlist based on the panel is visible. */
  private _setVisibilityClasses(classList: { [key: string]: boolean }) {
    classList[this._visibleClass] = this.showPanel;
    classList[this._hiddenClass] = !this.showPanel;
  }
}
