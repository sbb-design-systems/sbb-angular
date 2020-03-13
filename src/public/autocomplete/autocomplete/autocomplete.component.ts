import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  HasOptions,
  OptionComponent,
  OptionGroupComponent,
  SBB_OPTION_PARENT_COMPONENT
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
    public source: AutocompleteComponent,
    /** Option that was selected. */
    public option: OptionComponent
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
      useExisting: AutocompleteComponent
    }
  ]
})
export class AutocompleteComponent implements AfterContentInit, HasOptions {
  /** All of the defined select options. */
  @ContentChildren(OptionComponent, { descendants: true }) options: QueryList<OptionComponent>;

  /** All of the defined groups of options. */
  @ContentChildren(OptionGroupComponent) optionGroups: QueryList<OptionGroupComponent>;

  /** Manages active item in option list based on key events. */
  keyManager: ActiveDescendantKeyManager<OptionComponent>;

  /** Whether the autocomplete panel should be visible, depending on option length. */
  showPanel = false;

  /**
   * Whether the autocomplete panel is open.
   * @deprecated Use property open instead.
   */
  get isOpen(): boolean {
    return this.open;
  }

  /** Whether the autocomplete panel is open. */
  get open(): boolean {
    return this._isOpen && this.showPanel;
  }
  _isOpen = false;

  @HostBinding('class.sbb-autocomplete') sbbAutocomplete = false;

  /** @docs-private */
  @ViewChild(TemplateRef, { static: true }) template: TemplateRef<any>;

  /** Element for the panel containing the autocomplete options. */
  @ViewChild('panel') panel: ElementRef;

  /** Function that maps an option's control value to its display value in the trigger. */
  @Input() displayWith: ((value: any) => string) | null = null;

  /**
   * Whether the first option should be highlighted when the autocomplete panel is opened.
   */
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
      value.split(' ').forEach(className => (this._classList[className.trim()] = true));
      this._elementRef.nativeElement.className = '';
    }
  }
  _classList: { [key: string]: boolean } = {};

  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  id = `sbb-autocomplete-${nextId++}`;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  ngAfterContentInit() {
    this.keyManager = new ActiveDescendantKeyManager<OptionComponent>(this.options).withWrap();
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
    this._classList['sbb-autocomplete-visible'] = this.showPanel;
    this._classList['sbb-autocomplete-hidden'] = !this.showPanel;
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the `select` event. */
  emitSelectEvent(option: OptionComponent): void {
    const event = new SbbAutocompleteSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }
}
