import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ContentObserver } from '@angular/cdk/observers';
import { AsyncPipe } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { mixinVariant } from '@sbb-esta/angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/**
 * List of classes to add to SbbButton instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'sbb-button',
  'sbb-alt-button',
  'sbb-secondary-button',
  'sbb-ghost-button',
  'sbb-frameless-button',
  'sbb-link',
];

const INDICATOR_ATTRIBUTES = [
  'sbb-button',
  'sbb-secondary-button',
  'sbb-frameless-button',
  'sbb-link',
];

const VALID_ICON_BUTTON_ATTRIBUTES = [
  'sbb-button',
  'sbb-alt-button',
  'sbb-secondary-button',
  'sbb-ghost-button',
];

const DEFAULT_INDICATOR_ICONS: { [attr: string]: string } = {
  'sbb-button': 'arrow-right-small',
  'sbb-secondary-button': 'arrow-right-small',
  'sbb-frameless-button': 'plus-small',
  'sbb-link': 'arrow-right-small',
};

// Boilerplate for applying mixins to SbbButton.
// tslint:disable-next-line: naming-convention
const _SbbButtonMixinBase = mixinVariant(
  class {
    constructor(public _elementRef: ElementRef) {}
  },
);

/**
 * SBB design button.
 */
@Component({
  selector: `button[sbb-button], button[sbb-alt-button], button[sbb-secondary-button],
             button[sbb-ghost-button],  button[sbb-frameless-button], button[sbb-link]`,
  exportAs: 'sbbButton',
  host: {
    '[attr.disabled]': 'disabled || null',
    '[class._sbb-animation-noopable]': '_animationMode === "NoopAnimations"',
    '[class.sbb-disabled]': 'disabled',
    '[class.sbb-icon-button]': '_hasIconButtonClass',
  },
  templateUrl: 'button.html',
  inputs: ['disabled'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SbbIconModule, AsyncPipe],
})
export class SbbButton
  extends _SbbButtonMixinBase
  implements AfterViewInit, AfterContentInit, OnDestroy, FocusableOption
{
  /** Whether this button has an icon indicator. */
  _hasIconIndicator: boolean = this._hasHostAttributes(...INDICATOR_ATTRIBUTES);
  /** Whether the left indicator icon is visible. */
  _leftIconVisible: Observable<boolean>;
  /** Whether the right indicator icon is visible. */
  _rightIconVisible: Observable<boolean>;
  /** Whether the button has the `sbb-icon-button` class */
  _hasIconButtonClass: boolean = false;
  /** Whether the button is an icon button. */
  _isIconButton: Observable<boolean>;
  /**
   * The indicator icon, which will be shown around the button content
   * in the standard variant or behind the sbb-link in lean variant.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="plus-small"
   */
  @Input() svgIcon: string;

  /** Whether the button is disabled. */
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  @ContentChildren(SbbIcon, { read: ElementRef }) _iconRefs: QueryList<ElementRef> =
    new QueryList<ElementRef>();

  constructor(
    elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode: string,
    private _contentObserver: ContentObserver,
  ) {
    super(elementRef);

    // For each of the variant selectors that is present in the button's host
    // attributes, add the correct corresponding class.
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this._hasHostAttributes(attr)) {
        (this._getHostElement() as HTMLElement).classList.add(attr);

        // Assign the correct default indicator icon.
        if (attr in DEFAULT_INDICATOR_ICONS) {
          this.svgIcon = DEFAULT_INDICATOR_ICONS[attr];
        }
      }
    }

    // Add a class that applies to all buttons. This makes it easier to target if somebody
    // wants to target all sbb-angular buttons. We do it here rather than `host` to ensure that
    // the class is applied to derived classes.
    elementRef.nativeElement.classList.add('sbb-button-base');
  }

  ngAfterContentInit() {
    this._isIconButton = this._contentObserver.observe(this._elementRef).pipe(
      startWith([]),
      map(
        () =>
          this._hasHostAttributes(...VALID_ICON_BUTTON_ATTRIBUTES) &&
          this._elementRef.nativeElement.textContent.trim() === '' &&
          this._iconRefs.length === 1,
      ),
    );

    this._isIconButton.subscribe((isIconButton) => (this._hasIconButtonClass = isIconButton));

    this._leftIconVisible = combineLatest([this.variant, this._isIconButton]).pipe(
      map(([v, isIconButton]) => !isIconButton && v === 'standard' && this._hasIconIndicator),
    );
    this._rightIconVisible = combineLatest([this.variant, this._isIconButton]).pipe(
      map(
        ([v, isIconButton]) =>
          !isIconButton &&
          ((v === 'standard' && this._hasIconIndicator) ||
            (v === 'lean' && this._hasHostAttributes('sbb-link'))),
      ),
    );
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Focuses the button. */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (origin) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }
  }

  private _getHostElement() {
    return this._elementRef.nativeElement;
  }

  /** Gets whether the button has one of the given attributes. */
  private _hasHostAttributes(...attributes: string[]) {
    return attributes.some((attribute) => this._getHostElement().hasAttribute(attribute));
  }
}

/**
 * SBB design anchor button.
 */
@Component({
  selector: `a[sbb-button], a[sbb-alt-button], a[sbb-secondary-button],
             a[sbb-ghost-button], a[sbb-frameless-button], a[sbb-link]`,
  exportAs: 'sbbButton, sbbAnchor',
  host: {
    // Note that we ignore the user-specified tabindex when it's disabled for
    // consistency with the `sbb-button` applied on native buttons where even
    // though they have an index, they're not tabbable.
    '[attr.tabindex]': 'disabled ? -1 : tabIndex',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[class._sbb-animation-noopable]': '_animationMode === "NoopAnimations"',
    '[class.sbb-disabled]': 'disabled',
  },
  inputs: ['disabled'],
  templateUrl: 'button.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SbbIconModule, AsyncPipe],
})
export class SbbAnchor extends SbbButton implements AfterViewInit, OnDestroy {
  /** Tabindex of the button. */
  @Input() tabIndex: number;

  constructor(
    focusMonitor: FocusMonitor,
    elementRef: ElementRef,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode: string,
    private _ngZone: NgZone,
    contentObserver: ContentObserver,
  ) {
    super(elementRef, focusMonitor, animationMode, contentObserver);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this._ngZone.runOutsideAngular(() => {
      this._elementRef.nativeElement.addEventListener('click', this._haltDisabledEvents);
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._elementRef.nativeElement.removeEventListener('click', this._haltDisabledEvents);
  }

  _haltDisabledEvents = (event: Event): void => {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
}
