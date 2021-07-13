import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Animations used by the Sbb processflow.
 * @docs-private
 */
export const sbbProcessflowAnimations: {
  readonly stepTransition: AnimationTriggerMetadata;
} = {
  /** Animation that transitions the step along the X axis in a horizontal stepper. */
  stepTransition: trigger('stepTransition', [
    transition('* => previous, * => next', [
      style({ opacity: 1 }),
      animate('150ms ease', style({ opacity: 0 })),
    ]),
    transition('previous => current, next => current', [
      style({ opacity: 0 }),
      animate('500ms ease', style({ opacity: 1 })),
    ]),
    transition('void => current', animate('0s')),
  ]),
};
