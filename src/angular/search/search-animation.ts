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
    transition('void => *', animate('120ms cubic-bezier(0, 0, 0.2, 1)')),
    transition('* => void', animate('100ms 25ms linear')),
  ]),
};
