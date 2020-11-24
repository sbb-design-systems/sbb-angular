import {
  animate,
  AnimationTriggerMetadata,
  AUTO_STYLE,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * The following are all the animations for the sbb-usermenu component, with each
 * const containing the metadata for one animation.
 *
 * @docs-private
 */
export const sbbUsermenuAnimations: {
  readonly transformPanel: AnimationTriggerMetadata;
} = {
  /**
   * This animation transforms the usermenu's overlay panel on and off the page.
   */
  transformPanel: trigger('transformPanel', [
    state(
      'void',
      style({
        // Basically width and height ar set by minWidth and minHeight to guarantee the same width as the trigger has.
        // If 0 would be set, the animation doesn't look perfectly smooth.
        // Setting minWidth and min Height to our minimal expected width / height of the desktop view (48px) results in an improved animation behaviour.
        // In 4k and 5k the positive effect minimize because the minWidth / minHeight is larger than this start width / height.
        // Setting width and height by parameter is not possible because of the void state.
        width: '48px',
        height: '48px',
        opacity: 0,
      })
    ),
    state(
      'showing',
      style({
        width: '{{width}}',
        height: AUTO_STYLE,
        opacity: 1,
        maxHeight: '100%', // Enable scrolling for large amount of entries only after animation
      }),
      { params: { width: '288px' } }
    ),
    transition('void <=> *', animate('300ms cubic-bezier(.785,.135,.15,.86)')),
  ]),
};
