import { AnimationEvent } from '@angular/animations';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal
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
  HostBinding,
  HostListener,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation
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
  styleUrls: ['dialog-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [DIALOG_ANIMATIONS.slideDialog]
})
export class DialogContainerComponent extends BasePortalOutlet {
  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;

  @HostBinding('class.sbb-dialog-container')
  containerClass = true;

  @HostBinding('attr.tabindex')
  tabIndex = '-1';

  @HostBinding('attr.aria-modal')
  arialModal = 'true';

  @HostBinding('attr.id')
  get dialogContainerID() {
    return this.id;
  }

  @HostBinding('attr.role')
  get role() {
    return this.config.role;
  }

  @HostBinding('attr.aria-labelledby')
  get ariaLabelledbyAttr() {
    return this.config.ariaLabel ? null : this.ariaLabelledBy;
  }

  @HostBinding('attr.aria-label')
  get ariaLabel() {
    return this.config.ariaLabel;
  }

  @HostBinding('attr.aria-describedby')
  get describeDby() {
    return this.config.ariaDescribedBy || null;
  }

  @HostBinding('@slideDialog')
  get slideDialogAnimation() {
    return this.state;
  }

  @HostBinding('class.sbb-dialog-with-header')
  get hasHeaderClass() {
    return this.hasHeader;
  }

  @HostBinding('class.sbb-dialog-with-footer')
  get hasFooterClass() {
    return this.hasFooter;
  }

  /** The class that traps and manages focus within the dialog. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  /** State of the dialog animation. */
  state: 'void' | 'enter' | 'exit' = 'enter';

  /** Emits when an animation state changes. */
  animationStateChanged = new EventEmitter<AnimationEvent>();

  /** ID of the element that should be considered as the dialog's label. */
  ariaLabelledBy: string | null = null;

  /** ID for the container DOM element. */
  id: string;

  hasHeader: boolean | null = null;

  hasFooter: boolean | null = null;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _focusTrapFactory: FocusTrapFactory,
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

    this._savePreviouslyFocusedElement();
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

    this._savePreviouslyFocusedElement();
    return this.portalOutlet.attachTemplatePortal(portal);
  }

  /** Moves the focus inside the focus trap. */
  private _trapFocus() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }

    // If were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this.config.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    }
  }

  /** Restores focus to the element that was focused before the dialog opened. */
  private _restoreFocus() {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /** Saves a reference to the element that was focused before the dialog was opened. */
  private _savePreviouslyFocusedElement() {
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;

      // Note that there is no focus method when rendering on the server.
      if (this._elementRef.nativeElement.focus) {
        // Move focus onto the dialog immediately in order to prevent the user from accidentally
        // opening multiple dialoges at the same time. Needs to be async, because the element
        // may not be focusable immediately.
        Promise.resolve().then(() => this._elementRef.nativeElement.focus());
      }
    }
  }

  /** Callback, invoked whenever an animation on the host completes. */
  @HostListener('@slideDialog.done', ['$event'])
  onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'enter') {
      this._trapFocus();
    } else if (event.toState === 'exit') {
      this._restoreFocus();
    }

    this.animationStateChanged.emit(event);
  }

  /** Callback, invoked when an animation on the host starts. */
  @HostListener('@slideDialog.start', ['$event'])
  onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  /** Starts the dialog exit animation. */
  startExitAnimation(): void {
    this.state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorRef.markForCheck();
  }
}
