import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * The following are all the animations for the sbb-select component, with each
 * const containing the metadata for one animation.
 *
 * @docs-private
 */
export const sbbSelectAnimations: {
  readonly transformPanel: AnimationTriggerMetadata;
} = {
  /**
   * This animation transforms the select's overlay panel on and off the page.
   *
   * When the panel is attached to the DOM, it fades in and when the panel is removed, it fades out.
   */
  transformPanel: trigger('transformPanel', [
    state(
      'void',
      style({
        opacity: 0,
      })
    ),
    state(
      'showing',
      style({
        opacity: 1,
      })
    ),
    state(
      'showing-multiple',
      style({
        opacity: 1,
      })
    ),
    transition('void => *', animate('120ms cubic-bezier(0, 0, 0.2, 1)')),
    transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 }))),
  ]),
};
