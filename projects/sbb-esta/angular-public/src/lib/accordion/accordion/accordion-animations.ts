import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

/** Time and timing curve for expansion panel animations. */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/** Animations used by the expansion panel. */
export const sbbExpansionAnimations: {
  readonly bodyExpansion: AnimationTriggerMetadata;
} = {
  /** Animation that expands and collapses the panel content. */
  bodyExpansion: trigger('bodyExpansion', [
    state('collapsed', style({ height: '0px', visibility: 'hidden' })),
    state('expanded', style({ height: '*', visibility: 'visible' })),
    transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING))
  ])
};
