import { DomSanitizer } from '@angular/platform-browser';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  HostBinding,
  ViewEncapsulation,
  HostListener,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { Highlightable } from '@angular/cdk/a11y';
import { HighlightPipe } from './highlight.pipe';


/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueIdCounter = 0;

/** Event object emitted by AutocompleteOptionComponent when selected or deselected. */
export class SBBOptionSelectionChange {
  constructor(
    /** Reference to the option that emitted the event. */
    public source: OptionComponent,
    /** Whether the change in the option's value was a result of a user action. */
    public isUserInput = false) { }
}

@Component({
  selector: 'sbb-option',
  styleUrls: ['option.component.scss'],
  templateUrl: 'option.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HighlightPipe]
})
export class OptionComponent implements AfterViewChecked, OnDestroy, Highlightable {
  private _selected = false;
  private _active = false;
  private _disabled = false;
  private _mostRecentViewValue = '';

  @HostBinding('class.sbb-selected')
  get selected(): boolean { return this._selected; }

  @HostBinding('attr.aria-selected')
  get selectedString(): string { return this._selected.toString(); }

  @HostBinding('attr.aria-disabled')
  get disabledString(): string { return this._disabled.toString(); }

  @Input()
  @HostBinding('class.sbb-option-disabled')
  get disabled() { return this._disabled; }
  set disabled(value: any) { this._disabled = coerceBooleanProperty(value); }

  @HostBinding('attr.tabIndex')
  get _getTabIndex(): string { return this.disabled ? '-1' : '0'; }

  @HostBinding('class.sbb-active')
  get active(): boolean { return this._active; }

  @HostBinding('class.sbb-option-text') baseClass = true;

  @Input()
  value: any;

  @Input()
  id = `sbb-option-${_uniqueIdCounter++}`;

  /** Used for highlighting the textContent */
  filter: number | string | null;

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  readonly onSelectionChange = new EventEmitter<SBBOptionSelectionChange>();

  @ViewChild('highlight') highlightedText: ElementRef;
  @ViewChild('normal') normalText: ElementRef;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly _stateChanges = new Subject<void>();

  constructor(
    private _element: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _sanitizer: DomSanitizer
  ) { }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  @HostListener('click')
  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }


  get viewValue(): string {
    return (this._getHostElement().textContent || '').trim();
  }


  select(): void {
    if (!this._selected) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  focus(): void {
    const element = this._getHostElement();

    if (typeof element.focus === 'function') {
      element.focus();
    }
  }

  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      this._changeDetectorRef.markForCheck();
    }
  }

  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  getLabel(): string {
    return this.viewValue;
  }


  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }


  ngAfterViewChecked() {
    // Since parent components could be using the option's label to display the selected values
    // (e.g. `sbb-select`) and they don't have a way of knowing if the option's label has changed
    // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
    // relatively cheap, however we still limit them only to selected options in order to avoid
    // hitting the DOM too often.
    this._getHostElement().innerHTML = new HighlightPipe().transform(this._getHostElement().textContent, this.filter);
    if (this._selected) {
      const viewValue = this.viewValue;
      if (viewValue !== this._mostRecentViewValue) {
        this._mostRecentViewValue = viewValue;
        this._stateChanges.next();
      }
    }
  }

  ngOnDestroy() {
    this._stateChanges.complete();
  }

  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(new SBBOptionSelectionChange(this, isUserInput));
  }
}
