import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/** Animations used by notifications. */
export const sbbNotificationAnimations: {
  readonly showDismiss: AnimationTriggerMetadata;
} = {
  /** Animation that apply when showing or dismissing the notification. */
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
    transition('visible => dismissed', animate('0.25s cubic-bezier(0.4,0.0,0.2,1)')),
  ]),
};
