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
  readonly showDismiss: AnimationTriggerMetadata;
} = {
  /** Animation that apply when add and delete a ghettobox. */
  showDismiss: trigger('showDismiss', [
    state('void', style({ height: 0 })),
    state('visible', style({ height: '*' })),
    state('dismissed', style({ height: 0 })),
    transition('void => visible', animate('0.25s ease-in')),
    transition('visible => dismissed', animate('0.25s ease-out')),
  ]),
};
