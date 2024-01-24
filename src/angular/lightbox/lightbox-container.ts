import { AnimationEvent } from '@angular/animations';
import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayRef, ViewportRuler } from '@angular/cdk/overlay';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { SbbDialogConfig, _SbbDialogContainerBase } from '@sbb-esta/angular/dialog';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

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
    '[id]': '_config.id',
    '[attr.role]': '_config.role',
    '[attr.aria-modal]': '_config.ariaModal',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledByQueue[0]',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
    '[@lightboxContainer]': `_getAnimationState()`,
  },
  standalone: true,
  imports: [CdkPortalOutlet],
})
export class SbbLightboxContainer extends _SbbDialogContainerBase implements OnDestroy {
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

  /** Starts the dialog exit animation. */
  _startExitAnimation(): void {
    this._state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorReference.markForCheck();
  }

  private _destroyed = new Subject<void>();

  constructor(
    elementRef: ElementRef,
    focusTrapFactory: FocusTrapFactory,
    @Optional() @Inject(DOCUMENT) document: any,
    dialogConfig: SbbDialogConfig,
    checker: InteractivityChecker,
    ngZone: NgZone,
    overlayRef: OverlayRef,
    // @breaking-change: 18.0.0 Use base class _changeDetectorRef
    private _changeDetectorReference: ChangeDetectorRef,
    focusMonitor?: FocusMonitor,
    private _viewportRuler?: ViewportRuler,
  ) {
    super(
      elementRef,
      focusTrapFactory,
      document,
      dialogConfig,
      checker,
      ngZone,
      overlayRef,
      focusMonitor,
    );

    // Manually calculate the height of the Lightbox. This is necessary because on mobile Chrome and
    // Safari, 100vh includes the address bar and is therefore taller than the actual viewport.
    // See https://bugs.webkit.org/show_bug.cgi?id=141832#c5
    this._viewportRuler
      ?.change()
      .pipe(takeUntil(this._destroyed), startWith(null))
      .subscribe(() =>
        overlayRef.updateSize({
          height: this._viewportRuler!.getViewportSize().height,
        }),
      );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
}
