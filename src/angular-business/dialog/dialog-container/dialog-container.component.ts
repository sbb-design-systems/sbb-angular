import { AnimationEvent } from '@angular/animations';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
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

import { DIALOG_ANIMATIONS } from '../dialog/dialog-animations';
import { DialogConfig } from '../dialog/dialog-config';

/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export function throwDialogContentAlreadyAttachedError() {
  throw Error('Attempting to attach dialog content after content is already attached');
}

/**
 * Internal component that wraps user-provided dialog content.
 * @docs-private
 */
@Component({
  selector: 'sbb-dialog-container',
  templateUrl: 'dialog-container.component.html',
  styleUrls: ['dialog-container.component.css'],
  encapsulation: ViewEncapsulation.None,
  // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [DIALOG_ANIMATIONS.slideDialog],
  host: {
    class: 'sbb-dialog-container',
    tabindex: '-1',
    'aria-modal': 'true',
    '[attr.id]': 'id',
    '[attr.role]': 'config.role',
    '[attr.aria-labelledby]': 'config.ariaLabel ? null : ariaLabelledBy',
    '[attr.aria-label]': 'config.ariaLabel',
    '[attr.aria-describedby]': 'config.ariaDescribedBy || null',
    '[class.sbb-dialog-with-header]': 'this.hasHeader',
    '[class.sbb-dialog-with-footer]': 'this.hasFooter',
    '[@slideDialog]': 'state',
  },
})
export class DialogContainerComponent extends BasePortalOutlet {
  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;

  /** @deprecated internal detail */
  containerClass = true;
  /** @deprecated internal detail */
  tabIndex = '-1';
  /** @deprecated internal detail */
  arialModal = 'true';
  /** @deprecated internal detail */
  get dialogContainerID() {
    return this.id;
  }
  /** @deprecated internal detail */
  get role() {
    return this.config.role;
  }
  /** @deprecated internal detail */
  get ariaLabelledbyAttr() {
    return this.config.ariaLabel ? null : this.ariaLabelledBy;
  }
  /** @deprecated internal detail */
  get ariaLabel() {
    return this.config.ariaLabel;
  }
  /** @deprecated internal detail */
  get describeDby() {
    return this.config.ariaDescribedBy || null;
  }
  /** @deprecated internal detail */
  get slideDialogAnimation() {
    return this.state;
  }
  /** @deprecated internal detail */
  get hasHeaderClass() {
    return this.hasHeader;
  }
  /** @deprecated internal detail */
  get hasFooterClass() {
    return this.hasFooter;
  }

  /** The class that traps and manages focus within the dialog. */
  private _focusTrap: ConfigurableFocusTrap;

  /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  /**
   * State of the dialog animation.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  state: 'void' | 'enter' | 'exit' = 'enter';

  /**
   * Emits when an animation state changes.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  animationStateChanged = new EventEmitter<AnimationEvent>();

  /**
   * ID of the element that should be considered as the dialog's label.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  ariaLabelledBy: string | null = null;

  /**
   * ID for the container DOM element.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  id: string;

  /**
   * Whether the dialog has a header.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  hasHeader: boolean | null = null;

  /**
   * Whether the dialog has a footer.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  hasFooter: boolean | null = null;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) private _document: any,
    /** The dialog configuration. */
    public config: DialogConfig
  ) {
    super();
  }

  /**
   * Attach a ComponentPortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet.hasAttached()) {
      throwDialogContentAlreadyAttachedError();
    }

    this._setupFocusTrap();
    return this.portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet.hasAttached()) {
      throwDialogContentAlreadyAttachedError();
    }

    this._setupFocusTrap();
    return this.portalOutlet.attachTemplatePortal(portal);
  }

  /** Moves the focus inside the focus trap. */
  private _trapFocus() {
    // If we were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this.config.autoFocus) {
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
  private _restoreFocus() {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (toFocus && typeof toFocus.focus === 'function') {
      const activeElement = this._document.activeElement;
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
        toFocus.focus();
      }
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /**
   * Moves focus back into the dialog if it was moved out.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  recaptureFocus() {
    if (!this._containsFocus()) {
      const focusContainer = !this.config.autoFocus || !this._focusTrap.focusInitialElement();

      if (focusContainer) {
        this._elementRef.nativeElement.focus();
      }
    }
  }

  /**
   * Sets up the focus trand and saves a reference to the
   * element that was focused before the dialog was opened.
   */
  private _setupFocusTrap() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }

    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;

      // Note that there is no focus method when rendering on the server.
      if (this._elementRef.nativeElement.focus) {
        // Move focus onto the dialog immediately in order to prevent the user from accidentally
        // opening multiple dialogs at the same time. Needs to be async, because the element
        // may not be focusable immediately.
        Promise.resolve().then(() => this._elementRef.nativeElement.focus());
      }
    }
  }

  /** Returns whether focus is inside the dialog. */
  private _containsFocus() {
    const element = this._elementRef.nativeElement;
    const activeElement = this._document.activeElement;
    return element === activeElement || element.contains(activeElement);
  }

  /**
   * Callback, invoked whenever an animation on the host completes.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  @HostListener('@slideDialog.done', ['$event'])
  onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'enter') {
      this._trapFocus();
    } else if (event.toState === 'exit') {
      this._restoreFocus();
    }

    this.animationStateChanged.emit(event);
  }

  /**
   * Callback, invoked when an animation on the host starts.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  @HostListener('@slideDialog.start', ['$event'])
  onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  /**
   * Starts the dialog exit animation.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  startExitAnimation(): void {
    this.state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorRef.markForCheck();
  }
}
