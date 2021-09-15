import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/** Animations used by ghettobox. */
export const sbbGhettoboxAnimations: {
  readonly addRemove: AnimationTriggerMetadata;
} = {
  /** Animation that apply when add and delete a ghettobox. */
  addRemove: trigger('addDelete', [
    state('void', style({ opacity: 0 })),
    state('visible', style({ opacity: 1 })),
    state('removed', style({ opacity: 0 })),
    transition('void => visible', animate('0.25s ease-in')),
    transition('visible => removed', animate('0.25s ease-out')),
  ]),
};
