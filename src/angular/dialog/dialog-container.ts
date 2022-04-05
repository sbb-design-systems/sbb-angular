import { AnimationEvent } from '@angular/animations';
import { FocusMonitor, FocusOrigin, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  DomPortal,
  TemplatePortal,
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostListener,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { defaultParams, sbbDialogAnimations } from './dialog-animations';
import { SbbDialogConfig } from './dialog-config';

/** Event that captures the state of dialog container animations. */
interface DialogAnimationEvent {
  state: 'opened' | 'opening' | 'closing' | 'closed';
  totalTime: number;
}

/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export function throwSbbDialogContentAlreadyAttachedError() {
  throw Error('Attempting to attach dialog content after content is already attached');
}

/**
 * Base class for the `SbbDialogContainer`. The base class does not implement
 * animations as these are left to implementers of the dialog container.
 */
@Directive()
// tslint:disable-next-line: class-name naming-convention
export abstract class _SbbDialogContainerBase extends BasePortalOutlet {
  protected _document: Document;

  /** State of the animation. */
  _state: 'void' | 'enter' | 'exit' = 'enter';

  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  /** The class that traps and manages focus within the dialog. */
  private _focusTrap: FocusTrap;

  /** Emits when an animation state changes. */
  _animationStateChanged: EventEmitter<DialogAnimationEvent> =
    new EventEmitter<DialogAnimationEvent>();

  /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  /**
   * Type of interaction that led to the dialog being closed. This is used to determine
   * whether the focus style will be applied when returning focus to its original location
   * after the dialog is closed.
   */
  _closeInteractionType: FocusOrigin | null = null;

  /** ID of the element that should be considered as the dialog's label. */
  _ariaLabelledBy: string | null;

  /** ID for the container DOM element. */
  _id: string;

  constructor(
    protected _elementRef: ElementRef,
    protected _focusTrapFactory: FocusTrapFactory,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) document: any,
    /** The dialog configuration. */
    public _config: SbbDialogConfig,
    private _focusMonitor?: FocusMonitor
  ) {
    super();
    this._ariaLabelledBy = _config.ariaLabelledBy || null;
    this._document = document;
  }

  /** Starts the dialog exit animation. */
  abstract _startExitAnimation(): void;

  /** Initializes the dialog container with the attached content. */
  _initializeWithAttachedContent() {
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    // Save the previously focused element. This element will be re-focused
    // when the dialog closes.
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = _getFocusedElementPierceShadowDom();
    }

    if (!this._config.delayFocusTrap) {
      this._trapFocus();
    }

    // Move focus onto the dialog immediately in order to prevent the user
    // from accidentally opening multiple dialogs at the same time.
    this._focusDialogContainer();
  }

  /**
   * Attach a ComponentPortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwSbbDialogContentAlreadyAttachedError();
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwSbbDialogContentAlreadyAttachedError();
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /**
   * Attaches a DOM portal to the dialog container.
   * @param portal Portal to be attached.
   */
  override attachDomPortal = (portal: DomPortal) => {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwSbbDialogContentAlreadyAttachedError();
    }

    return this._portalOutlet.attachDomPortal(portal);
  };

  _getAnimationState() {
    return {
      value: this._state,
      params: {
        // See https://github.com/angular/components/commit/575332c9296c28776376f4b4f7fb39c9743761aa
        'enterAnimationDuration': // prettier-ignore
            this._config.enterAnimationDuration || defaultParams.params.enterAnimationDuration,
        'exitAnimationDuration': // prettier-ignore
            this._config.exitAnimationDuration || defaultParams.params.exitAnimationDuration,
      },
    };
  }

  /** Moves focus back into the dialog if it was moved out. */
  _recaptureFocus() {
    if (!this._containsFocus()) {
      const focusContainer = !this._config.autoFocus || !this._focusTrap.focusInitialElement();

      if (focusContainer) {
        this._elementRef.nativeElement.focus();
      }
    }
  }

  /** Moves the focus inside the focus trap. */
  protected _trapFocus() {
    // If we were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this._config.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    } else if (!this._containsFocus()) {
      // Otherwise ensure that focus is on the dialog container. It's possible that a different
      // component tried to move focus while the open animation was running. See:
      // https://github.com/angular/components/issues/16215. Note that we only want to do this
      // if the focus isn't inside the dialog already, because it's possible that the consumer
      // turned off `autoFocus` in order to move focus themselves.
      this._elementRef.nativeElement.focus();
    }
  }

  /** Restores focus to the element that was focused before the dialog opened. */
  protected _restoreFocus() {
    const previousElement = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (
      this._config.restoreFocus &&
      previousElement &&
      typeof previousElement.focus === 'function'
    ) {
      const activeElement = _getFocusedElementPierceShadowDom();
      const element = this._elementRef.nativeElement;

      // Make sure that focus is still inside the dialog or is on the body (usually because a
      // non-focusable element like the backdrop was clicked) before moving it. It's possible that
      // the consumer moved it themselves before the animation was done, in which case we shouldn't
      // do anything.
      if (
        !activeElement ||
        activeElement === this._document.body ||
        activeElement === element ||
        element.contains(activeElement)
      ) {
        if (this._focusMonitor) {
          this._focusMonitor.focusVia(previousElement, this._closeInteractionType);
          this._closeInteractionType = null;
        } else {
          previousElement.focus();
        }
      }
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /** Focuses the dialog container. */
  private _focusDialogContainer() {
    // Note that there is no focus method when rendering on the server.
    if (this._elementRef.nativeElement.focus) {
      this._elementRef.nativeElement.focus();
    }
  }

  /** Returns whether focus is inside the dialog. */
  private _containsFocus() {
    const element = this._elementRef.nativeElement;
    const activeElement = _getFocusedElementPierceShadowDom();
    return element === activeElement || element.contains(activeElement);
  }

  /**
   * Callback for when the open dialog animation has finished. Intended to
   * be called by sub-classes that use different animation implementations.
   */
  protected _openAnimationDone(totalTime: number) {
    if (this._config.delayFocusTrap) {
      this._trapFocus();
    }

    this._animationStateChanged.next({ state: 'opened', totalTime });
  }
}

/**
 * Internal component that wraps user-provided dialog content.
 * @docs-private
 */
@Component({
  selector: 'sbb-dialog-container',
  templateUrl: 'dialog-container.html',
  styleUrls: ['dialog.css'],
  encapsulation: ViewEncapsulation.None,
  // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [sbbDialogAnimations.dialogContainer],
  host: {
    class: 'sbb-dialog-container',
    tabindex: '-1',
    'aria-modal': 'true',
    '[id]': '_id',
    '[attr.role]': '_config.role',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
    '[@dialogContainer]': `_getAnimationState()`,
  },
})
export class SbbDialogContainer extends _SbbDialogContainerBase {
  /** Callback, invoked whenever an animation on the host completes. */
  @HostListener('@dialogContainer.done', ['$event'])
  _onAnimationDone({ toState, totalTime }: AnimationEvent) {
    if (toState === 'enter') {
      this._openAnimationDone(totalTime);
    } else if (toState === 'exit') {
      this._restoreFocus();
      this._animationStateChanged.next({ state: 'closed', totalTime });
    }
  }

  /** Callback, invoked when an animation on the host starts. */
  @HostListener('@dialogContainer.start', ['$event'])
  _onAnimationStart({ toState, totalTime }: AnimationEvent) {
    if (toState === 'enter') {
      this._animationStateChanged.next({ state: 'opening', totalTime });
    } else if (toState === 'exit' || toState === 'void') {
      this._animationStateChanged.next({ state: 'closing', totalTime });
    }
  }

  /** Starts the dialog exit animation. */
  _startExitAnimation(): void {
    this._state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorRef.markForCheck();
  }
}
