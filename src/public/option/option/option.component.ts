import { Highlightable } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';

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
    public isUserInput = false
  ) {}
}

/**
 * Describes a parent component that manages a list of options.
 * Contains properties that the options can inherit.
 * @docs-private
 */
export interface SbbOptionParentComponent {
  multiple?: boolean;
}

/**
 * Injection token used to provide the parent component to options.
 */
export const SBB_OPTION_PARENT_COMPONENT = new InjectionToken<SbbOptionParentComponent>(
  'SBB_OPTION_PARENT_COMPONENT'
);

@Component({
  selector: 'sbb-option',
  styleUrls: ['option.component.css'],
  templateUrl: 'option.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent implements AfterViewChecked, OnDestroy, Highlightable {
  mostRecentViewValue = '';

  @HostBinding('class.sbb-selected')
  selected = false;

  @HostBinding('class.sbb-option-multiple')
  get multiple() {
    return this._parent && this._parent.multiple;
  }

  @HostBinding('attr.role')
  role = 'option';

  @HostBinding('attr.aria-selected')
  get ariaSelected() {
    return this.selected || (this.multiple ? false : null);
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled() {
    return this.disabled.toString();
  }

  @Input()
  @HostBinding('class.sbb-option-disabled')
  get disabled() {
    return (this.group && this.group.disabled) || this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;

  @HostBinding('attr.tabIndex')
  get tabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  @HostBinding('class.sbb-active')
  active = false;

  @HostBinding('class.sbb-option-text') baseClass = true;

  @Input() value: any;

  @Input()
  @HostBinding('attr.id')
  id = `sbb-option-${uniqueIdCounter++}`;

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  readonly onSelectionChange = new EventEmitter<SBBOptionSelectionChange>();

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly stateChanges = new Subject<void>();

  private _originalInnerHtml?: string;
  private _highlightValue?: string;
  private _highlighted = false;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private _document: any,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(SBB_OPTION_PARENT_COMPONENT)
    private _parent: SbbOptionParentComponent,
    @Optional() readonly group: OptionGroupComponent
  ) {}

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
      this.selected = this.multiple ? !this.selected : true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  get viewValue(): string {
    return (this.getHostElement().textContent || '').trim();
  }

  select(): void {
    if (!this.selected) {
      this.selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  deselect(): void {
    if (this.selected) {
      this.selected = false;
      this._changeDetectorRef.markForCheck();
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
      this._changeDetectorRef.markForCheck();
    }
  }

  setInactiveStyles(): void {
    if (this.active) {
      this.active = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  getLabel(): string {
    return this.viewValue;
  }

  getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
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

  /** @docs-private */
  _highlight(value: string) {
    if (this._originalInnerHtml === undefined) {
      this._originalInnerHtml = this._elementRef.nativeElement.innerHTML;
    } else if (value === this._highlightValue) {
      return;
    } else if (this._highlighted) {
      this._elementRef.nativeElement.innerHTML = this._originalInnerHtml;
      this._highlighted = false;
    }

    this._highlightValue = value;
    if (value && this._originalInnerHtml) {
      // Escape all regex characters
      const escapedValue = value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const replacement = new RegExp(`${escapedValue}+`, 'i');
      const nodes = this._findAllTextNodesWithMatch(replacement);
      nodes.forEach(n => this._highlightNode(n, replacement));
      this._highlighted = !!nodes.length;
    }
  }

  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(new SBBOptionSelectionChange(this, isUserInput));
  }

  private _findAllTextNodesWithMatch(
    matcher: RegExp,
    node: Node = this._elementRef.nativeElement
  ): ChildNode[] {
    const nodes: ChildNode[] = [];
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      // Text nodes are nodeType 3
      if (childNode.nodeType === 3 && matcher.test(childNode.textContent || '')) {
        nodes.push(childNode);
      } else if (childNode.childNodes.length) {
        nodes.push(...this._findAllTextNodesWithMatch(matcher, childNode));
      }
    }

    return nodes;
  }

  /**
   * Replace the content with a (partial) match, with text nodes and span elements
   * which contain the highlightable content.
   * @param node The node with (partial) content to highlight.
   * @param matcher The content to highlight.
   */
  private _highlightNode(node: ChildNode, matcher: RegExp) {
    const nodes: Node[] = [];
    const doc: Document = this._document;
    matcher.lastIndex = 0;
    let text = node.textContent || '';
    let match: RegExpMatchArray | null;
    do {
      match = text.match(matcher);
      if (!match) {
        nodes.push(doc.createTextNode(text));
        continue;
      } else if (match.index) {
        nodes.push(doc.createTextNode(text.substring(0, match.index)));
        text = text.substring(match.index);
      }

      const strong = doc.createElement('strong');
      strong.textContent = match[0];
      nodes.push(strong);
      text = text.substring(match[0].length);
    } while (match);

    const parent = node.parentNode!;
    nodes.forEach(n => parent.insertBefore(n, node));
    parent.removeChild(node);
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
export function getOptionScrollPosition(
  optionIndex: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number
): number {
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
