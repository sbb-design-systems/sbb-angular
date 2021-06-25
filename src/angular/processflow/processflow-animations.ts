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
    state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
    // Transition to `inherit`, rather than `visible`,
    // because visibility on a child element the one from the parent,
    // making this element focusable inside of a `hidden` element.
    state('current', style({ transform: 'none', visibility: 'inherit' })),
    state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
    transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')),
  ]),
};
