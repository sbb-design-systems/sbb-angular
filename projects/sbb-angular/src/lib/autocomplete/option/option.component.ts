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
  ViewChild,
  QueryList,
  Optional
} from '@angular/core';
import { Subject } from 'rxjs';
import { Highlightable } from '@angular/cdk/a11y';
import { OptionGroupComponent } from '../option-group/option-group.component';


/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let uniqueIdCounter = 0;

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent implements AfterViewChecked, OnDestroy, Highlightable {
  _disabled = false;
  mostRecentViewValue = '';

  @HostBinding('class.sbb-selected')
  selected = false;

  @HostBinding('attr.aria-selected')
  get selectedString(): string { return this.selected.toString(); }

  @HostBinding('attr.aria-disabled')
  get disabledString(): string { return this._disabled.toString(); }

  @Input()
  @HostBinding('class.sbb-option-disabled')
  get disabled() { return (this.group && this.group.disabled) || this._disabled; }
  set disabled(value: any) { this._disabled = coerceBooleanProperty(value); }

  @HostBinding('attr.tabIndex')
  get _getTabIndex(): string { return this.disabled ? '-1' : '0'; }

  @HostBinding('class.sbb-active')
  active = false;

  @HostBinding('class.sbb-option-text') baseClass = true;

  @Input()
  value: any;

  @Input()
  id = `sbb-option-${uniqueIdCounter++}`;

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  readonly onSelectionChange = new EventEmitter<SBBOptionSelectionChange>();

  @ViewChild('highlight') highlightedText: ElementRef;
  @ViewChild('normal') normalText: ElementRef;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly stateChanges = new Subject<void>();

  constructor(
    private element: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional() readonly group: OptionGroupComponent
  ) { }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this.selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  @HostListener('click')
  selectViaInteraction(): void {
    if (!this.disabled) {
      this.selected = true;
      this.changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  get viewValue(): string {
    return (this.getHostElement().textContent || '').trim();
  }

  select(): void {
    if (!this.selected) {
      this.selected = true;
      this.changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  deselect(): void {
    if (this.selected) {
      this.selected = false;
      this.changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  focus(): void {
    const element = this.getHostElement();

    if (typeof element.focus === 'function') {
      element.focus();
    }
  }

  setActiveStyles(): void {
    if (!this.active) {
      this.active = true;
      this.changeDetectorRef.markForCheck();
    }
  }

  setInactiveStyles(): void {
    if (this.active) {
      this.active = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  getLabel(): string {
    return this.viewValue;
  }

  getHostElement(): HTMLElement {
    return this.element.nativeElement;
  }

  ngAfterViewChecked() {
    // Since parent components could be using the option's label to display the selected values
    // (e.g. `sbb-select`) and they don't have a way of knowing if the option's label has changed
    // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
    // relatively cheap, however we still limit them only to selected options in order to avoid
    // hitting the DOM too often.
    if (this.selected) {
      const viewValue = this.viewValue;
      if (viewValue !== this.mostRecentViewValue) {
        this.mostRecentViewValue = viewValue;
        this.stateChanges.next();
      }
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(new SBBOptionSelectionChange(this, isUserInput));
  }
}

/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 * @param optionIndex Index of the option to be scrolled into the view.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
export function getOptionScrollPosition(optionIndex: number, optionHeight: number,
  currentScrollPosition: number, panelHeight: number): number {
  const optionOffset = optionIndex * optionHeight;

  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }

  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }

  return currentScrollPosition;
}

/**
 * Counts the amount of option group labels that precede the specified option.
 * @param optionIndex Index of the option at which to start counting.
 * @param options Flat list of all of the options.
 * @param optionGroups Flat list of all of the option groups.
 * @docs-private
 */
export function countGroupLabelsBeforeOption(
  optionIndex: number,
  options: QueryList<OptionComponent>,
  optionGroups: QueryList<OptionGroupComponent>
): number {

  if (optionGroups.length) {
    const optionsArray = options.toArray();
    const groups = optionGroups.toArray();
    let groupCounter = 0;

    for (let i = 0; i < optionIndex + 1; i++) {
      if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
        groupCounter++;
      }
    }

    return groupCounter;
  }

  return 0;
}
