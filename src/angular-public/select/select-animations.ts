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
   * When the panel is attached to the DOM, it expands its width by the amount of padding, scales it
   * up to 100% on the Y axis, fades in its border, and translates slightly up and to the
   * side to ensure the option text correctly overlaps the trigger text.
   *
   * When the panel is removed from the DOM, it simply fades out linearly.
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
