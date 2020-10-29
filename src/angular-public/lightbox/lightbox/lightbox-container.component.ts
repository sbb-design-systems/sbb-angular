import { AnimationEvent } from '@angular/animations';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostListener,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { SBB_LIGHTBOX_ANIMATIONS } from './lightbox-animations';
import { SbbLightboxConfig } from './lightbox-config';

/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export function throwLightboxContentAlreadyAttachedError() {
  throw Error('Attempting to attach lightbox content after content is already attached');
}

/**
 * Internal component that wraps user-provided lightbox content.
 * @docs-private
 */
@Component({
  selector: 'sbb-lightbox-container',
  templateUrl: 'lightbox-container.component.html',
  styleUrls: ['lightbox-container.component.css'],
  encapsulation: ViewEncapsulation.None,
  // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [SBB_LIGHTBOX_ANIMATIONS.slideLightbox],
  host: {
    class: 'sbb-lightbox-container',
    tabindex: '-1',
    'aria-modal': 'true',
    '[attr.id]': '_id',
    '[attr.role]': 'config.role',
    '[attr.aria-labelledby]': 'config.ariaLabel ? null : _ariaLabelledBy',
    '[attr.aria-label]': 'config.ariaLabel',
    '[attr.aria-describedby]': 'config.ariaDescribedBy || null',
    '[class.sbb-lightbox-with-header]': '_hasHeader',
    '[class.sbb-lightbox-with-footer]': '_hasFooter',
    '[@slideLightbox]': '_state',
  },
})
export class SbbLightboxContainer extends BasePortalOutlet {
  /** The portal outlet inside of this container into which the lightbox content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;

  /** The class that traps and manages focus within the lightbox. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the lightbox was opened. Save this to restore upon close. */
  private _elementFocusedBeforeLightboxWasOpened: HTMLElement | null = null;

  /** State of the lightbox animation. */
  _state: 'void' | 'enter' | 'exit' = 'enter';

  /** Emits when an animation state changes. */
  _animationStateChanged: EventEmitter<AnimationEvent> = new EventEmitter<AnimationEvent>();

  /** ID of the element that should be considered as the lightbox's label. */
  _ariaLabelledBy: string | null = null;

  /** ID for the container DOM element. */
  _id: string;

  /** Whether the lightbox has a header. */
  _hasHeader: boolean | null = null;

  /** Whether the lightbox has a footer. */
  _hasFooter: boolean | null = null;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _focusTrapFactory: FocusTrapFactory,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) private _document: any,
    /** The dialog configuration. */
    public config: SbbLightboxConfig
  ) {
    super();
  }

  /**
   * Attach a ComponentPortal as content to this lightbox container.
   * @param portal Portal to be attached as the lightbox content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet.hasAttached()) {
      throwLightboxContentAlreadyAttachedError();
    }

    this._savePreviouslyFocusedElement();
    return this.portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this lightbox container.
   * @param portal Portal to be attached as the lightbox content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet.hasAttached()) {
      throwLightboxContentAlreadyAttachedError();
    }

    this._savePreviouslyFocusedElement();
    return this.portalOutlet.attachTemplatePortal(portal);
  }

  /** Moves the focus inside the focus trap. */
  private _trapFocus() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }

    // If were to attempt to focus immediately, then the content of the lightbox would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this.config.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    }
  }

  /** Restores focus to the element that was focused before the dialog opened. */
  private _restoreFocus() {
    const toFocus = this._elementFocusedBeforeLightboxWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /** Saves a reference to the element that was focused before the lightbox was opened. */
  private _savePreviouslyFocusedElement() {
    if (this._document) {
      this._elementFocusedBeforeLightboxWasOpened = this._document.activeElement as HTMLElement;

      // Note that there is no focus method when rendering on the server.
      if (this._elementRef.nativeElement.focus) {
        // Move focus onto the lightbox immediately in order to prevent the user from accidentally
        // opening multiple lightboxes at the same time. Needs to be async, because the element
        // may not be focusable immediately.
        Promise.resolve().then(() => this._elementRef.nativeElement.focus());
      }
    }
  }

  /** Callback, invoked whenever an animation on the host completes. */
  @HostListener('@slideLightbox.done', ['$event'])
  _onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'enter') {
      this._trapFocus();
    } else if (event.toState === 'exit') {
      this._restoreFocus();
    }

    this._animationStateChanged.emit(event);
  }

  /** Callback, invoked when an animation on the host starts. */
  @HostListener('@slideLightbox.start', ['$event'])
  _onAnimationStart(event: AnimationEvent) {
    this._animationStateChanged.emit(event);
  }

  /** Starts the dialog exit animation. */
  _startExitAnimation(): void {
    this._state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorRef.markForCheck();
  }
}
