import { AnimationEvent } from '@angular/animations';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { _SbbDialogContainerBase } from '@sbb-esta/angular/dialog';

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
    '[id]': '_id',
    '[attr.role]': '_config.role',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
    '[@lightboxContainer]': '_state',
  },
})
export class SbbLightboxContainer extends _SbbDialogContainerBase {
  /** State of the lightbox animation. */
  _state: 'void' | 'enter' | 'exit' = 'enter';

  /** Callback, invoked whenever an animation on the host completes. */
  @HostListener('@lightboxContainer.done', ['$event'])
  _onAnimationDone({ toState, totalTime }: AnimationEvent) {
    if (toState === 'enter') {
      this._trapFocus();
      this._animationStateChanged.next({ state: 'opened', totalTime });
    } else if (toState === 'exit') {
      this._restoreFocus();
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
    this._changeDetectorRef.markForCheck();
  }
}
