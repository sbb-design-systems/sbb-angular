import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
      animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'none', opacity: 1 }))
    ),
    transition(
      '* => void, * => exit',
      animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))
    ),
  ]),
};

/*

/ ** Animations used by Dialog. * /
export const SBB_DIALOG_ANIMATIONS: {
  readonly slideDialog: AnimationTriggerMetadata;
} = {
  /** Animation that slides the Dialog in and out of view and fades the opacity. * /
  slideDialog: trigger('slideDialog', [
    // Note: The `enter` animation doesn't transition to something like `translate3d(0, 0, 0)
    // scale(1)`, because for some reason specifying the transform explicitly, causes IE both
    // to blur the dialog content and decimate the animation performance. Leaving it as `none`
    // solves both issues.
    state('enter', style({ transform: 'none', opacity: 1 })),
    state('void', style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
    state('exit', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
    transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
};
*/
