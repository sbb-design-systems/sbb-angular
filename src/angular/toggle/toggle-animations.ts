import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

const SBB_TOGGLE_ANIMATION_TRANSITION = '225ms cubic-bezier(0.785, 0.135, 0.15, 0.86)';

/**
 * Animations used by the SBB toggle.
 * @docs-private
 */
export const sbbToggleAnimations: {
  readonly translateHeight: AnimationTriggerMetadata;
} = {
  translateHeight: trigger('translateHeight', [
    state('void', style({ height: 0, paddingTop: 0, paddingBottom: 0 })),
    state('auto', style({ height: '*', paddingTop: '*', paddingBottom: '*' })),
    transition('fixed => auto, initial => auto, * => void', [
      style({ height: '{{currentHeight}}px' }),
      animate(SBB_TOGGLE_ANIMATION_TRANSITION),
    ]),
    transition('void => fixed, void => auto', animate(SBB_TOGGLE_ANIMATION_TRANSITION)),
    transition('void => initial', animate(0)),
  ]),
};
