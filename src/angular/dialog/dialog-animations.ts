import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Default parameters for the animation for backwards compatibility.
 * @docs-private
 */
export const sbbDialogAnimationsDefaultParams = {
  params: { enterAnimationDuration: '150ms', exitAnimationDuration: '75ms' },
};

/**
 * Animations used by SbbDialog.
 * @docs-private
 */
export const sbbDialogAnimations: {
  readonly dialogContainer: AnimationTriggerMetadata;
} = {
  /** Animation that is applied on the dialog container by default. */
  dialogContainer: trigger('dialogContainer', [
    // Note: The `enter` animation transitions to `transform: none`, because for some reason
    // specifying the transform explicitly, causes IE both to blur the dialog content and
    // decimate the animation performance. Leaving it as `none` solves both issues.
    state('void, exit', style({ opacity: 0, transform: 'scale(0.7)' })),
    state('enter', style({ transform: 'none' })),
    transition(
      '* => enter',
      group([
        animate(
          '{{enterAnimationDuration}} cubic-bezier(0, 0, 0.2, 1)',
          style({ transform: 'none', opacity: 1 })
        ),
        query('@*', animateChild(), { optional: true }),
      ]),
      sbbDialogAnimationsDefaultParams
    ),
    transition(
      '* => void, * => exit',
      group([
        animate('{{exitAnimationDuration}} cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 })),
        query('@*', animateChild(), { optional: true }),
      ]),
      sbbDialogAnimationsDefaultParams
    ),
  ]),
};
