import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { CanDisableCtor, mixinDisabled } from '@sbb-esta/angular-core/common-behaviors';
import { BooleanInput } from '@angular/cdk/coercion';

// Boilerplate for applying mixins to HeaderMenuItemDirective.
/** @docs-private */
class HeaderMenuItemBase {}
// tslint:disable-next-line: naming-convention
const _HeaderMenuItemBase: CanDisableCtor & typeof HeaderMenuItemBase = mixinDisabled(
  HeaderMenuItemBase
);

@Directive({
  selector: '[sbbHeaderMenuItem]'
})
export class HeaderMenuItemDirective extends _HeaderMenuItemBase
  implements FocusableOption, OnDestroy {
  /** ARIA role for the menu item. */
  @Input() @HostBinding('attr.role') role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox' =
    'menuitem';

  private _document: Document;

  /** Whether the menu item is highlighted. */
  _highlighted: boolean = false;

  /** Whether the menu item acts as a trigger for a sub-menu. */
  _triggersSubmenu: boolean = false;

  /** Emits whenever a this item is clicked when enabled. */
  @Output() click: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _focusMonitor?: FocusMonitor,
    @Inject(DOCUMENT) document?: any
  ) {
    super();
    if (_focusMonitor) {
      // Start monitoring the element so it gets the appropriate focused classes. We want
      // to show the focus style for menu items only when the focus was not caused by a
      // mouse or touch interaction.
      _focusMonitor.monitor(this._elementRef, false);
    }

    this._document = document;
  }

  /** Focuses the menu item. */
  focus(origin: FocusOrigin = 'program', options?: FocusOptions): void {
    if (this._focusMonitor) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }
  }

  ngOnDestroy() {
    if (this._focusMonitor) {
      this._focusMonitor.stopMonitoring(this._elementRef);
    }
  }

  /** Used to set the `tabindex`. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Returns the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** Prevents the default element actions if it is disabled. */
  @HostListener('click', ['$event'])
  _checkDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    const element: HTMLElement = this._elementRef.nativeElement;
    const textNodeType = this._document ? this._document.TEXT_NODE : 3;
    let output = '';

    if (element.childNodes) {
      const length = element.childNodes.length;

      // Go through all the top-level text nodes and extract their text.
      // We skip anything that's not a text node to prevent the text from
      // being thrown off by something like an icon.
      for (let i = 0; i < length; i++) {
        if (element.childNodes[i].nodeType === textNodeType) {
          output += element.childNodes[i].textContent;
        }
      }
    }

    return output.trim();
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
  // tslint:enable: member-ordering
}
