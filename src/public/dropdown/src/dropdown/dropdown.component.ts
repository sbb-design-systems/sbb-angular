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
  DropdownItemDirective,
  SBB_DROPDOWN_ITEM_PARENT_COMPONENT
} from '../dropdown-item.directive';

/**
 * Dropdown IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextId = 0;

/** Event object that is emitted when an dropdown option is selected. */
export class DropdownSelectedEvent {
  constructor(
    /** Reference to the dropdown panel that emitted the event. */
    public source: DropdownComponent,
    /** Option that was selected. */
    public item: DropdownItemDirective
  ) {}
}

/** Default `sbb-dropdown` options that can be overridden. */
export interface DropdownDefaultOptions {
  /** Whether the first option should be highlighted when an dropdown panel is opened. */
  autoActiveFirstOption?: boolean;
}

@Component({
  selector: 'sbb-dropdown',
  exportAs: 'sbbDropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SBB_DROPDOWN_ITEM_PARENT_COMPONENT,
      useExisting: DropdownComponent
    }
  ]
})
export class DropdownComponent implements AfterContentInit {
  /**
   * Reference to the dropdown items.
   */
  @ContentChildren(DropdownItemDirective) options: QueryList<DropdownItemDirective>;

  /** Manages active item in option list based on key events. */
  keyManager: ActiveDescendantKeyManager<DropdownItemDirective>;

  /** Whether the dropdown panel should be visible, depending on option length. */
  showPanel = false;

  /** Whether the dropdown panel is open. */
  get open(): boolean {
    return this._open && this.showPanel;
  }
  set open(value: boolean) {
    this._open = value;
  }
  private _open = false;

  /** Css class of sbb-dropdown. */
  @HostBinding('class.sbb-dropdown') sbbDropdown = true;

  /** @docs-private */
  @ViewChild(TemplateRef, { static: true }) template: TemplateRef<any>;

  /** Element for the panel containing the dropdown options. */
  @ViewChild('panel') panel: ElementRef;

  /**
   * Whether the first option should be highlighted when the dropdown panel is opened.
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
   * Specify the width of the dropdown panel.  Can be any CSS sizing value, otherwise it will
   * match the width of its host.
   */
  @Input() panelWidth: string | number;

  /** Event that is emitted whenever an option from the list is selected. */
  @Output() readonly optionSelected: EventEmitter<DropdownSelectedEvent> = new EventEmitter<
    DropdownSelectedEvent
  >();

  /** Event that is emitted when the dropdown panel is opened. */
  @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when the dropdown panel is closed. */
  @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Takes classes set on the host sbb-dropdown element and applies them to the panel
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

  /** Unique ID to be used by dropdown trigger's "aria-owns" property. */
  id = `sbb-dropdown-${nextId++}`;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  ngAfterContentInit() {
    this.keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
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
    this._classList['sbb-dropdown-visible'] = this.showPanel;
    this._classList['sbb-dropdown-hidden'] = !this.showPanel;
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the `select` event. */
  emitSelectEvent(option: DropdownItemDirective): void {
    const event = new DropdownSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }
}
