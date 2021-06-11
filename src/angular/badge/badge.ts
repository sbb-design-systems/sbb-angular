import { AriaDescriber } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { CanDisable, mixinDisabled } from '@sbb-esta/angular/core';

let nextId = 0;

// Boilerplate for applying mixins to SbbBadge.
/** @docs-private */
// tslint:disable-next-line: naming-convention
const _SbbBadgeBase = mixinDisabled(class {});

/** Allowed position options for sbbBadgePosition */
export type SbbBadgePosition = 'after' | 'above';

/** Directive to display a text badge. */
@Directive({
  selector: '[sbbBadge]',
  inputs: ['disabled: sbbBadgeDisabled'],
  host: {
    class: 'sbb-badge',
    '[class.sbb-badge-above]': 'position !== "after"',
    '[class.sbb-badge-after]': 'position === "after"',
    '[class.sbb-badge-hidden]': 'hidden || !_hasContent',
    '[class.sbb-badge-disabled]': 'disabled',
  },
})
export class SbbBadge extends _SbbBadgeBase implements OnDestroy, OnChanges, CanDisable {
  /** Whether the badge has any content. */
  _hasContent: boolean = false;

  /** Position the badge should reside. */
  @Input('sbbBadgePosition') position: SbbBadgePosition = 'above';

  /** The content for the badge */
  @Input('sbbBadge') content: string | number | undefined | null;

  /** Message used to describe the decorated element via aria-describedby */
  @Input('sbbBadgeDescription')
  get description(): string {
    return this._description;
  }
  set description(newDescription: string) {
    if (newDescription !== this._description) {
      const badgeElement = this._badgeElement;
      this._updateHostAriaDescription(newDescription, this._description);
      this._description = newDescription;

      if (badgeElement) {
        newDescription
          ? badgeElement.setAttribute('aria-label', newDescription)
          : badgeElement.removeAttribute('aria-label');
      }
    }
  }
  private _description: string;

  /** Whether the badge is hidden. */
  @Input('sbbBadgeHidden')
  get hidden(): boolean {
    return this._hidden;
  }
  set hidden(val: boolean) {
    this._hidden = coerceBooleanProperty(val);
  }
  private _hidden: boolean;

  /** Unique id for the badge */
  _id: number = nextId++;

  private _badgeElement: HTMLElement | undefined;

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _ariaDescriber: AriaDescriber,
    private _renderer: Renderer2,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string
  ) {
    super();

    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      const nativeElement = _elementRef.nativeElement;
      if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
        throw Error('sbbBadge must be attached to an element node.');
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const contentChange = changes['content'];

    if (contentChange) {
      const value = contentChange.currentValue;
      this._hasContent = value != null && `${value}`.trim().length > 0;
      this._updateTextContent();
    }
  }

  ngOnDestroy() {
    const badgeElement = this._badgeElement;

    if (badgeElement) {
      if (this.description) {
        this._ariaDescriber.removeDescription(badgeElement, this.description);
      }

      // When creating a badge through the Renderer, Angular will keep it in an index.
      // We have to destroy it ourselves, otherwise it'll be retained in memory.
      if (this._renderer.destroyNode) {
        this._renderer.destroyNode(badgeElement);
      }
    }
  }

  /**
   * Gets the element into which the badge's content is being rendered.
   * Undefined if the element hasn't been created (e.g. if the badge doesn't have content).
   */
  getBadgeElement(): HTMLElement | undefined {
    return this._badgeElement;
  }

  /** Injects a span element into the DOM with the content. */
  private _updateTextContent(): HTMLSpanElement {
    if (!this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
    } else {
      this._badgeElement.textContent = this._stringifyContent();
    }
    return this._badgeElement;
  }

  /** Creates the badge element */
  private _createBadgeElement(): HTMLElement {
    const badgeElement = this._renderer.createElement('span');
    const activeClass = 'sbb-badge-active';
    const contentClass = 'sbb-badge-content';

    // Clear any existing badges which may have persisted from a server-side render.
    this._clearExistingBadges(contentClass);
    badgeElement.setAttribute('id', `sbb-badge-content-${this._id}`);
    badgeElement.classList.add(contentClass);
    badgeElement.textContent = this._stringifyContent();

    if (this._animationMode === 'NoopAnimations') {
      badgeElement.classList.add('_sbb-animation-noopable');
    }

    if (this.description) {
      badgeElement.setAttribute('aria-label', this.description);
    }

    this._elementRef.nativeElement.appendChild(badgeElement);

    // animate in after insertion
    if (typeof requestAnimationFrame === 'function' && this._animationMode !== 'NoopAnimations') {
      this._ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          badgeElement.classList.add(activeClass);
        });
      });
    } else {
      badgeElement.classList.add(activeClass);
    }

    return badgeElement;
  }

  /** Sets the aria-label property on the element */
  private _updateHostAriaDescription(newDescription: string, oldDescription: string): void {
    // ensure content available before setting label
    const content = this._updateTextContent();

    if (oldDescription) {
      this._ariaDescriber.removeDescription(content, oldDescription);
    }

    if (newDescription) {
      this._ariaDescriber.describe(content, newDescription);
    }
  }

  /** Clears any existing badges that might be left over from server-side rendering. */
  private _clearExistingBadges(cssClass: string) {
    const element = this._elementRef.nativeElement;
    let childCount = element.children.length;

    // Use a reverse while, because we'll be removing elements from the list as we're iterating.
    while (childCount--) {
      const currentChild = element.children[childCount];

      if (currentChild.classList.contains(cssClass)) {
        element.removeChild(currentChild);
      }
    }
  }

  /** Gets the string representation of the badge content. */
  private _stringifyContent(): string {
    // Convert null and undefined to an empty string which is consistent
    // with how Angular handles them in inside template interpolations.
    const content = this.content;
    return content == null ? '' : `${content}`;
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_hidden: BooleanInput;
}
