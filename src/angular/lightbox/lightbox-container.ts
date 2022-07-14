import { AnimationEvent } from '@angular/animations';
import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  NgZone,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { SbbDialogConfig, _SbbDialogContainerBase } from '@sbb-esta/angular/dialog';

import { sbbLightboxAnimations } from './lightbox-animations';

/**
 * Internal component that wraps user-provided lightbox content.
 * @docs-private
 */
@Component({
  selector: 'sbb-lightbox-container',
  templateUrl: 'lightbox-container.html',
  styleUrls: ['lightbox.css'],
  encapsulation: ViewEncapsulation.None,
  // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [sbbLightboxAnimations.lightboxContainer],
  host: {
    class: 'sbb-lightbox-container',
    tabindex: '-1',
    'aria-modal': 'true',
    '[id]': '_config.id',
    '[attr.role]': '_config.role',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
    '[@lightboxContainer]': `_getAnimationState()`,
    '[style.height.px]': '_innerHeight',
  },
})
export class SbbLightboxContainer extends _SbbDialogContainerBase implements OnInit {
  /** Callback, invoked whenever an animation on the host completes. */
  @HostListener('@lightboxContainer.done', ['$event'])
  _onAnimationDone({ toState, totalTime }: AnimationEvent) {
    if (toState === 'enter') {
      this._trapFocus();
      this._animationStateChanged.next({ state: 'opened', totalTime });
    } else if (toState === 'exit') {
      this._animationStateChanged.next({ state: 'closed', totalTime });
    }
  }

  /** Callback, invoked when an animation on the host starts. */
  @HostListener('@lightboxContainer.start', ['$event'])
  _onAnimationStart({ toState, totalTime }: AnimationEvent) {
    if (toState === 'enter') {
      this._animationStateChanged.next({ state: 'opening', totalTime });
    } else if (toState === 'exit' || toState === 'void') {
      this._animationStateChanged.next({ state: 'closing', totalTime });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this._innerHeight = window.innerHeight;
  }

  /** Starts the dialog exit animation. */
  _startExitAnimation(): void {
    this._state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorRef.markForCheck();
  }

  _innerHeight: number;

  constructor(
    elementRef: ElementRef,
    focusTrapFactory: FocusTrapFactory,
    @Optional() @Inject(DOCUMENT) document: any,
    dialogConfig: SbbDialogConfig,
    checker: InteractivityChecker,
    ngZone: NgZone,
    overlayRef: OverlayRef,
    private _changeDetectorRef: ChangeDetectorRef,
    focusMonitor?: FocusMonitor
  ) {
    super(
      elementRef,
      focusTrapFactory,
      document,
      dialogConfig,
      checker,
      ngZone,
      overlayRef,
      focusMonitor
    );
  }

  ngOnInit(): void {
    this._innerHeight = window.innerHeight;
  }
}
