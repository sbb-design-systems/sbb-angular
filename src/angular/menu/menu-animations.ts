import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Animations used by the sbb-menu component.
 * @docs-private
 */
export const sbbMenuAnimations: {
  readonly transformMenu: AnimationTriggerMetadata;
} = {
  /**
   * This animation controls the menu panel's entry and exit from the page.
   *
   * When the menu panel is added to the DOM, it scales in and fades in its border.
   *
   * When the menu panel is removed from the DOM, it simply fades out after a brief
   * delay to display the ripple.
   */
  transformMenu: trigger('transformMenu', [
    state(
      'void',
      style({
        opacity: 0,
      })
    ),
    transition(
      'void => enter',
      animate(
        '120ms cubic-bezier(0, 0, 0.2, 1)',
        style({
          opacity: 1,
        })
      )
    ),
    transition('* => void', animate('100ms linear', style({ opacity: 0 }))),
  ]),
};
