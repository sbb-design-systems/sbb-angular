import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  keyframes,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

const SORT_ANIMATION_TRANSITION = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/**
 * Animations used by SbbSort.
 * @docs-private
 */
export const sbbSortAnimations: {
  readonly indicator: AnimationTriggerMetadata;
  readonly arrowOpacity: AnimationTriggerMetadata;
  readonly arrowPosition: AnimationTriggerMetadata;
  readonly allowChildren: AnimationTriggerMetadata;
} = {
  /** Animation that moves the sort indicator. */
  indicator: trigger('indicator', [
    state('active-asc, asc', style({ transform: 'scaleY(-1)' })),
    state('active-desc, desc', style({ transform: 'scaleY(1)' })),
    transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION)),
    transition('asc <=> desc', animate('0ms')),
  ]),

  /** Animation that controls the arrow opacity. */
  arrowOpacity: trigger('arrowOpacity', [
    state('desc-to-active, asc-to-active, active', style({ opacity: 1 })),
    state('desc-to-hint, asc-to-hint, hint', style({ opacity: 0.54 })),
    state(
      'hint-to-desc, active-to-desc, desc, hint-to-asc, active-to-asc, asc, void',
      style({ opacity: 0 })
    ),
    // Transition between all states except for immediate transitions
    transition('* => asc, * => desc, * => active, * => hint, * => void', animate('0ms')),
    transition('* <=> *', animate(SORT_ANIMATION_TRANSITION)),
  ]),

  /**
   * Animation for the translation of the arrow as a whole. States are separated into two
   * groups: ones with animations and others that are immediate. Immediate states are asc, desc,
   * peek, and active. The other states define a specific animation (source-to-destination)
   * and are determined as a function of their prev user-perceived state and what the next state
   * should be.
   */
  arrowPosition: trigger('arrowPosition', [
    // Hidden Above => Hint Center
    transition(
      '* => desc-to-hint, * => desc-to-active',
      animate(
        SORT_ANIMATION_TRANSITION,
        keyframes([style({ transform: 'translateY(-25%)' }), style({ transform: 'translateY(0)' })])
      )
    ),
    // Hint Center => Hidden Below
    transition(
      '* => hint-to-desc, * => active-to-desc',
      animate(
        SORT_ANIMATION_TRANSITION,
        keyframes([style({ transform: 'translateY(0)' }), style({ transform: 'translateY(25%)' })])
      )
    ),
    // Hidden Below => Hint Center
    transition(
      '* => asc-to-hint, * => asc-to-active',
      animate(
        SORT_ANIMATION_TRANSITION,
        keyframes([style({ transform: 'translateY(25%)' }), style({ transform: 'translateY(0)' })])
      )
    ),
    // Hint Center => Hidden Above
    transition(
      '* => hint-to-asc, * => active-to-asc',
      animate(
        SORT_ANIMATION_TRANSITION,
        keyframes([style({ transform: 'translateY(0)' }), style({ transform: 'translateY(-25%)' })])
      )
    ),
    state(
      'desc-to-hint, asc-to-hint, hint, desc-to-active, asc-to-active, active',
      style({ transform: 'translateY(0)' })
    ),
    state('hint-to-desc, active-to-desc, desc', style({ transform: 'translateY(-25%)' })),
    state('hint-to-asc, active-to-asc, asc', style({ transform: 'translateY(25%)' })),
  ]),

  /** Necessary trigger that calls animate on children animations. */
  allowChildren: trigger('allowChildren', [
    transition('* <=> *', [query('@*', animateChild(), { optional: true })]),
  ]),
};
