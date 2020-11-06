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
        width: '48px', // TODO: start with trigger width
        height: '48px', // TODO: 4k 5k
        opacity: 0,
      })
    ),
    state(
      'showing',
      style({
        width: '{{width}}',
        height: AUTO_STYLE,
        opacity: 1,
      }),
      { params: { width: '288px' } }
    ),
    transition('void <=> *', animate('300ms cubic-bezier(.785,.135,.15,.86)')),
  ]),
};
