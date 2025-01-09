import { AriaDescriber } from '@angular/cdk/a11y';
import {
  ANIMATION_MODULE_TYPE,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

let nextId = 0;

/** Allowed position options for sbbBadgePosition */
export type SbbBadgePosition = 'after' | 'above';

const BADGE_CONTENT_CLASS = 'sbb-badge-content';

/** Directive to display a text badge. */
@Directive({
  selector: '[sbbBadge]',
  host: {
    class: 'sbb-badge',
    '[class.sbb-badge-above]': 'position !== "after"',
    '[class.sbb-badge-after]': 'position === "after"',
    '[class.sbb-badge-hidden]': 'hidden || !content',
    '[class.sbb-badge-disabled]': 'disabled',
  },
})
export class SbbBadge implements OnInit, OnDestroy {
  private _ngZone = inject(NgZone);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _ariaDescriber = inject(AriaDescriber);
  private _renderer = inject(Renderer2);
  private _animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });

  /** Position the badge should reside. */
  @Input('sbbBadgePosition') position: SbbBadgePosition = 'above';

  /** The content for the badge */
  @Input('sbbBadge')
  get content(): string | number | undefined | null {
    return this._content;
  }
  set content(newContent: string | number | undefined | null) {
    this._updateRenderedContent(newContent);
  }
  private _content: string | number | undefined | null;

  /** Message used to describe the decorated element via aria-describedby */
  @Input('sbbBadgeDescription')
  get description(): string {
    return this._description;
  }
  set description(newDescription: string) {
    this._updateHostAriaDescription(newDescription);
  }
  private _description: string;

  /** Whether the badge is hidden. */
  @Input({ alias: 'sbbBadgeHidden', transform: booleanAttribute }) hidden: boolean;

  /** Whether the badge is disabled. */
  @Input({ alias: 'sbbBadgeDisabled', transform: booleanAttribute }) disabled: boolean;

  /** Unique id for the badge */
  _id: number = nextId++;

  /** Visible badge element. */
  private _badgeElement: HTMLElement | undefined;

  /** Whether the OnInit lifecycle hook has run yet */
  private _isInitialized = false;

  constructor(...args: unknown[]);
  constructor() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      const nativeElement = this._elementRef.nativeElement;
      if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
        throw Error('sbbBadge must be attached to an element node.');
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

  ngOnInit() {
    // We may have server-side rendered badge that we need to clear.
    // We need to do this in ngOnInit because the full content of the component
    // on which the badge is attached won't necessarily be in the DOM until this point.
    this._clearExistingBadges();

    if (this.content && !this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
      this._updateRenderedContent(this.content);
    }

    this._isInitialized = true;
  }

  ngOnDestroy() {
    // ViewEngine only: when creating a badge through the Renderer, Angular remembers its index.
    // We have to destroy it ourselves, otherwise it'll be retained in memory.
    if (this._renderer.destroyNode) {
      this._renderer.destroyNode(this._badgeElement);
    }

    this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
  }

  /** Creates the badge element */
  private _createBadgeElement(): HTMLElement {
    const badgeElement = this._renderer.createElement('span');
    const activeClass = 'sbb-badge-active';

    badgeElement.setAttribute('id', `sbb-badge-content-${this._id}`);

    // The badge is aria-hidden because we don't want it to appear in the page's navigation
    // flow. Instead, we use the badge to describe the decorated element with aria-describedby.
    badgeElement.setAttribute('aria-hidden', 'true');
    badgeElement.classList.add(BADGE_CONTENT_CLASS);

    if (this._animationMode === 'NoopAnimations') {
      badgeElement.classList.add('_sbb-animation-noopable');
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

  /** Update the text content of the badge element in the DOM, creating the element if necessary. */
  private _updateRenderedContent(newContent: string | number | undefined | null): void {
    const newContentNormalized: string = `${newContent ?? ''}`.trim();

    // Don't create the badge element if the directive isn't initialized because we want to
    // append the badge element to the *end* of the host element's content for backwards
    // compatibility.
    if (this._isInitialized && newContentNormalized && !this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
    }

    if (this._badgeElement) {
      this._badgeElement.textContent = newContentNormalized;
    }

    this._content = newContentNormalized;
  }

  /** Updates the host element's aria description via AriaDescriber. */
  private _updateHostAriaDescription(newDescription: string): void {
    this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
    if (newDescription) {
      this._ariaDescriber.describe(this._elementRef.nativeElement, newDescription);
    }
    this._description = newDescription;
  }

  /** Clears any existing badges that might be left over from server-side rendering. */
  private _clearExistingBadges() {
    // Only check direct children of this host element in order to avoid deleting
    // any badges that might exist in descendant elements.
    const badges = this._elementRef.nativeElement.querySelectorAll(
      `:scope > .${BADGE_CONTENT_CLASS}`,
    );
    for (const badgeElement of Array.from(badges)) {
      if (badgeElement !== this._badgeElement) {
        badgeElement.remove();
      }
    }
  }
}
