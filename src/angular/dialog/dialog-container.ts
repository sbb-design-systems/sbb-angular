import { AnimationEvent } from '@angular/animations';
import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';

import { sbbDialogAnimations, sbbDialogAnimationsDefaultParams } from './dialog-animations';
import { SbbDialogConfig } from './dialog-config';

/** Event that captures the state of dialog container animations. */
interface DialogAnimationEvent {
  state: 'opened' | 'opening' | 'closing' | 'closed';
  totalTime: number;
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
    '[id]': '_config.id',
    '[attr.role]': '_config.role',
    '[attr.aria-modal]': '_config.ariaModal',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledByQueue[0]',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
    '[@dialogContainer]': `_getAnimationState()`,
  },
  standalone: true,
  imports: [CdkPortalOutlet],
})
export class SbbDialogContainer extends CdkDialogContainer<SbbDialogConfig> {
  /** Emits when an animation state changes. */
  _animationStateChanged: EventEmitter<DialogAnimationEvent> =
    new EventEmitter<DialogAnimationEvent>();

  /** State of the animation. */
  _state: 'void' | 'enter' | 'exit' = 'enter';

  /** Callback, invoked whenever an animation on the host completes. */
  @HostListener('@dialogContainer.done', ['$event'])
  _onAnimationDone({ toState, totalTime }: AnimationEvent) {
    if (toState === 'enter') {
      this._openAnimationDone(totalTime);
    } else if (toState === 'exit') {
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

  /** Initializes the dialog container with the attached content. */
  protected override _captureInitialFocus(): void {
    if (!this._config.delayFocusTrap) {
      this._trapFocus();
    }
  }

  _getAnimationState() {
    return {
      value: this._state,
      params: {
        // See https://github.com/angular/components/commit/575332c9296c28776376f4b4f7fb39c9743761aa
        'enterAnimationDuration': // prettier-ignore
          this._config.enterAnimationDuration || sbbDialogAnimationsDefaultParams.params.enterAnimationDuration,
        'exitAnimationDuration': // prettier-ignore
          this._config.exitAnimationDuration || sbbDialogAnimationsDefaultParams.params.exitAnimationDuration,
      },
    };
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
