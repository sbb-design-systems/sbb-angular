import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/** Animations used by the header. */
export const sbbHeaderAnimations: {
  readonly menu: AnimationTriggerMetadata;
} = {
  menu: trigger('menu', [
    state(
      'open',
      style({
        left: 0,
      })
    ),
    state(
      'void',
      style({
        left: -305,
        visibility: 'hidden',
      })
    ),
    transition('open => void, void => open', [animate('0.3s ease-in-out')]),
  ]),
};
