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
    state(
      'void, dismissed',
      style({ height: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0, borderBottomWidth: 0 })
    ),
    state(
      'visible',
      style({
        height: '*',
        paddingTop: '*',
        paddingBottom: '*',
        borderTopWidth: '*',
        borderBottomWidth: '*',
      })
    ),
    transition('void => visible', animate('0.25s cubic-bezier(0.4,0.0,0.2,1)')),
    transition('visible => dismissed', animate('0.25s cubic-bezier(0.4,0.0,0.2,1)')),
  ]),
};
