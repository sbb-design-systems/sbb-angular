import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  SbbOption,
  SbbOptionGroup,
  SBB_OPTION_PARENT_COMPONENT,
} from '@sbb-esta/angular-public/option';

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
    public option: SbbOption
  ) {}
}

/** Default `sbb-autocomplete` options that can be overridden. */
export interface SbbAutocompleteDefaultOptions {
  /** Whether the first option should be highlighted when an autocomplete panel is opened. */
  autoActiveFirstOption?: boolean;
}

@Component({
  selector: 'sbb-autocomplete',
  exportAs: 'sbbAutocomplete',
  templateUrl: 'autocomplete.component.html',
  styleUrls: ['autocomplete.component.css'],
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
export class SbbAutocomplete implements AfterContentInit {
  /** Manages active item in option list based on key events. */
  keyManager: ActiveDescendantKeyManager<SbbOption>;

  /** Whether the autocomplete panel should be visible, depending on option length. */
  showPanel: boolean = false;

  /** Whether the autocomplete panel is open. */
  get isOpen(): boolean {
    return this._isOpen && this.showPanel;
  }
  _isOpen: boolean = false;

  /** @docs-private */
  @ViewChild(TemplateRef, { static: true }) template: TemplateRef<any>;

  /** Element for the panel containing the autocomplete options. */
  @ViewChild('panel') panel: ElementRef;

  /** All of the defined select options. */
  @ContentChildren(SbbOption, { descendants: true }) options: QueryList<SbbOption>;

  /** All of the defined groups of options. */
  @ContentChildren(SbbOptionGroup) optionGroups: QueryList<SbbOptionGroup>;

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

  /** Whether the first option should be highlighted when the autocomplete panel is opened. */
  @Input()
  get autoActiveFirstOption(): boolean {
    return this._autoActiveFirstOption;
  }
  set autoActiveFirstOption(value: boolean) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }
  private _autoActiveFirstOption: boolean;

  /**
   * Specify the width of the autocomplete panel.  Can be any CSS sizing value, otherwise it will
   * match the width of its host.
   */
  @Input() panelWidth: string | number;

  /** Event that is emitted whenever an option from the list is selected. */
  @Output() readonly optionSelected: EventEmitter<SbbAutocompleteSelectedEvent> = new EventEmitter<
    SbbAutocompleteSelectedEvent
  >();

  /** Event that is emitted when the autocomplete panel is opened. */
  @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Takes classes set on the host sbb-autocomplete element and applies them to the panel
   * inside the overlay container to allow for easy styling.
   */
  @Input('class')
  set classList(value: string) {
    if (value && value.length) {
      this._classList = value.split(' ').reduce((classList, className) => {
        classList[className.trim()] = true;
        return classList;
      }, {} as { [key: string]: boolean });
    } else {
      this._classList = {};
    }

    this._setVisibilityClasses(this._classList);
    this._elementRef.nativeElement.className = '';
  }
  _classList: { [key: string]: boolean } = {};

  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  id: string = `sbb-autocomplete-${nextId++}`;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  ngAfterContentInit() {
    this.keyManager = new ActiveDescendantKeyManager<SbbOption>(this.options).withWrap();
    // Set the initial visibility state.
    this.setVisibility();
  }

  /**
   * Sets the panel scrollTop. This allows us to manually scroll to display options
   * above or below the fold, as they are not actually being focused when active.
   */
  setScrollTop(scrollTop: number): void {
    if (this.panel) {
      this.panel.nativeElement.scrollTop = scrollTop;
    }
  }

  /** Returns the panel's scrollTop. */
  getScrollTop(): number {
    return this.panel ? this.panel.nativeElement.scrollTop : 0;
  }

  /** Panel should hide itself when the option list is empty. */
  setVisibility() {
    this.showPanel = !!this.options.length;
    this._setVisibilityClasses(this._classList);
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the `select` event. */
  emitSelectEvent(option: SbbOption): void {
    const event = new SbbAutocompleteSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }

  /** Sets the autocomplete visibility classes on a classlist based on the panel is visible. */
  private _setVisibilityClasses(classList: { [key: string]: boolean }) {
    classList['sbb-autocomplete-visible'] = this.showPanel;
    classList['sbb-autocomplete-hidden'] = !this.showPanel;
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_autoActiveFirstOption: BooleanInput;
  // tslint:enable: member-ordering
}
