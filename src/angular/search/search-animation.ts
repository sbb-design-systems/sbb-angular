import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * The following is the animation for the sbb-header-search component.
 *
 * @docs-private
 */
export const sbbSearchAnimations: {
  readonly growShrink: AnimationTriggerMetadata;
} = {
  /**
   * This animation transforms the select's overlay panel on and off the page.
   *
   * When the panel is attached to the DOM, it fades in and when the panel is removed, it fades out.
   */
  growShrink: trigger('growShrink', [
    state('void', style({ opacity: 0, width: '0px' })),
    state('open', style({ opacity: 1, width: '*' })),
    transition('void => *', animate('300ms ease')),
    transition('* => void', animate('300ms 25ms linear')),
  ]),
};
