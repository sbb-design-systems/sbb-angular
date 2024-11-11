import { FocusableOption, FocusOrigin, Highlightable, _IdGenerator } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';

import { TypeRef } from '../common-behaviors/type-ref';

import { SbbOptgroup, SBB_OPTGROUP } from './optgroup';
import { SbbOptionParentComponent, SBB_OPTION_PARENT_COMPONENT } from './option-parent';
import { SbbPseudoCheckbox } from './pseudo-checkbox';

/** Event object emitted by SbbOption when selected or deselected. */
export class SbbOptionSelectionChange<T = any> {
  constructor(
    /** Reference to the option that emitted the event. */
    public source: SbbOption<T>,
    /** Whether the change in the option's value was a result of a user action. */
    public isUserInput = false,
  ) {}
}

@Component({
  selector: 'sbb-option',
  exportAs: 'sbbOption',
  styleUrls: ['option.css'],
  templateUrl: 'option.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SbbPseudoCheckbox],
  host: {
    class: 'sbb-option sbb-menu-item sbb-link-reset',
    role: 'option',
    '[attr.tabindex]': '_getTabIndex()',
    '[class.sbb-selected]': 'selected',
    '[class.sbb-option-multiple]': 'multiple',
    '[class.sbb-focused]': 'active',
    '[id]': 'id',
    '[attr.aria-selected]': 'selected',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[class.sbb-disabled]': 'disabled',
  },
  standalone: true,
})
export class SbbOption<T = any>
  implements AfterViewChecked, OnDestroy, FocusableOption, Highlightable
{
  private _selected = false;
  private _active = false;
  private _disabled = false;
  private _mostRecentViewValue = '';
  private _originalInnerHtml?: string;
  private _highlightValue?: string;
  private _highlighted = false;

  /** Whether the wrapping component is in multiple selection mode. */
  get multiple() {
    return this._parent && this._parent.multiple;
  }

  /** Whether or not the option is currently selected. */
  get selected(): boolean {
    return this._selected;
  }

  /** The form value of the option. */
  @Input() value: T;

  /** The unique ID of the option. */
  @Input() id: string = inject(_IdGenerator).getId('sbb-option-');

  /** Whether the option is disabled. */
  @Input()
  get disabled(): boolean {
    return (this.group && this.group.disabled) || this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }

  /** Event emitted when the option is selected or deselected. */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() readonly onSelectionChange = new EventEmitter<SbbOptionSelectionChange<T>>();

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly _stateChanges = new Subject<void>();

  constructor(
    private _element: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private _document: any,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(SBB_OPTION_PARENT_COMPONENT)
    private _parent: SbbOptionParentComponent,
    @Optional() @Inject(SBB_OPTGROUP) readonly group: SbbOptgroup,
  ) {}

  /**
   * Whether or not the option is currently active and ready to be selected.
   * An active option displays styles as if it is focused, but the
   * focus is actually retained somewhere else. This comes in handy
   * for components like autocomplete where focus must remain on the input.
   */
  get active(): boolean {
    return this._active;
  }

  /**
   * The displayed value of the option. It is necessary to show the selected option in the
   * select's trigger.
   */
  get viewValue(): string {
    // TODO(kara): Add input property alternative for node envs.
    return (this._getHostElement().textContent || '').trim();
  }

  /** Selects the option. */
  select(): void {
    if (!this.selected) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Deselects the option. */
  deselect(emitEvent = true): void {
    if (this._selected) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();

      if (emitEvent) {
        this._emitSelectionChangeEvent();
      }
    }
  }

  /** Sets focus onto this option. */
  focus(_origin?: FocusOrigin, options?: FocusOptions): void {
    // Note that we aren't using `_origin`, but we need to keep it because some internal consumers
    // use `SbbOption` in a `FocusKeyManager` and we need it to match `FocusableOption`.
    const element = this._getHostElement();

    if (typeof element.focus === 'function') {
      element.focus(options);
    }
  }

  /**
   * This method sets display styles on the option to make it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setActiveStyles(): void {
    if (!this.active) {
      this._active = true;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * This method removes display styles on the option that made it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setInactiveStyles(): void {
    if (this.active) {
      this._active = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    return this.viewValue;
  }

  /** Ensures the option is selected when activated from the keyboard. */
  @HostListener('keydown', ['$event'])
  _handleKeydown(event: TypeRef<KeyboardEvent>): void {
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !hasModifierKey(event)) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  /**
   * `Selects the option while indicating the selection came from the user. Used to
   * determine if the select's view -> model callback should be invoked.`
   */
  @HostListener('click')
  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = this.multiple ? !this.selected : true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** Returns the correct tabindex for the option depending on disabled state. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Gets the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }

  ngAfterViewChecked() {
    // Since parent components could be using the option's label to display the selected values
    // (e.g. `sbb-select`) and they don't have a way of knowing if the option's label has changed
    // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
    // relatively cheap, however we still limit them only to selected options in order to avoid
    // hitting the DOM too often.
    if (this._selected) {
      const viewValue = this.viewValue;

      if (viewValue !== this._mostRecentViewValue) {
        if (this._mostRecentViewValue) {
          this._stateChanges.next();
        }

        this._mostRecentViewValue = viewValue;
      }
    }
  }

  ngOnDestroy() {
    this._stateChanges.complete();
  }

  /**
   * Highlights a text part of the option by wrapping it with a strong element.
   * @docs-private
   */
  _highlight(value: string, localeNormalizer?: ((value: string) => string) | null) {
    if (this._originalInnerHtml === undefined) {
      this._originalInnerHtml = this._element.nativeElement.innerHTML;
    } else if (value === this._highlightValue) {
      return;
    } else if (this._highlighted) {
      this._element.nativeElement.innerHTML = this._originalInnerHtml;
      this._highlighted = false;
    }

    this._highlightValue = value;
    if (value && this._originalInnerHtml) {
      const normalizer = localeNormalizer || ((v) => v);
      value = normalizer(value);
      // Escape all regex characters
      const escapedValue = value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const matcher = new RegExp(`${escapedValue}+`, 'i');
      const nodes = this._findAllTextNodesWithMatch(matcher, normalizer);
      nodes.forEach((n) => this._highlightNode(n, matcher, normalizer));
      this._highlighted = !!nodes.length;
    }
  }

  private _findAllTextNodesWithMatch(
    matcher: RegExp,
    localeNormalizer: (value: string) => string,
    node: Node = this._element.nativeElement,
  ): ChildNode[] {
    const nodes: ChildNode[] = [];
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      // Text nodes are nodeType 3
      if (childNode.nodeType === 3 && matcher.test(localeNormalizer(childNode.textContent || ''))) {
        nodes.push(childNode);
      } else if (childNode.childNodes.length) {
        nodes.push(...this._findAllTextNodesWithMatch(matcher, localeNormalizer, childNode));
      }
    }

    return nodes;
  }

  /**
   * Replace the content with a (partial) match, with text nodes and span elements
   * which contain the highlightable content.
   * @param node The node with (partial) content to highlight.
   * @param matcher The content to highlight.
   * @param localeNormalizer function to normalize locale chars
   */
  private _highlightNode(
    node: ChildNode,
    matcher: RegExp,
    localeNormalizer: (value: string) => string,
  ) {
    const nodes: Node[] = [];
    const doc: Document = this._document;
    matcher.lastIndex = 0;
    let text = node.textContent || '';
    let match: RegExpMatchArray | null;
    do {
      match = localeNormalizer(text).match(matcher);
      if (!match) {
        nodes.push(doc.createTextNode(text));
        continue;
      } else if (match.index) {
        nodes.push(doc.createTextNode(text.substring(0, match.index)));
        text = text.substring(match.index);
      }

      const strong = doc.createElement('strong');
      strong.textContent = text.substring(0, match[0].length);
      nodes.push(strong);
      text = text.substring(match[0].length);
    } while (match);

    const parent = node.parentNode!;
    nodes.forEach((n) => parent.insertBefore(n, node));
    parent.removeChild(node);
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(new SbbOptionSelectionChange<T>(this, isUserInput));
  }
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
  options: QueryList<SbbOption>,
  optionGroups: QueryList<SbbOptgroup>,
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

/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 * @param optionOffset Offset of the option from the top of the panel.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
export function getOptionScrollPosition(
  optionOffset: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number,
): number {
  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }

  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }

  return currentScrollPosition;
}
