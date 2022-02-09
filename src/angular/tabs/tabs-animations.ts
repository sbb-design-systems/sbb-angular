import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Animations used by the SBB tabs.
 * @docs-private
 */
export const sbbTabsAnimations: {
  readonly translateTab: AnimationTriggerMetadata;
} = {
  translateTab: trigger('translateTab', [
    state(
      'hidden',
      style({
        // Normally this is redundant since we detach the content from the DOM, but if the user
        // opted into keeping the content in the DOM, we have to hide it so it isn't focusable.
        visibility: 'hidden',
      })
    ),
    transition('* => void, * => hidden', [
      style({ opacity: 1 }),
      animate('{{animationDurationHide}} ease', style({ opacity: 0 })),
    ]),
    transition('hidden => show', [
      style({ opacity: 0, visibility: 'visible' }),
      animate('{{animationDuration}} ease', style({ opacity: 1 })),
    ]),
    transition('void => show', animate('0s')),
  ]),
};
