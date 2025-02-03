import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Animations used by the sbb angular sidebars.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
export const sbbSidebarAnimations: {
  readonly transformSidebar: AnimationTriggerMetadata;
} = {
  /** Animation that slides a sidebar in and out. */
  transformSidebar: trigger('transform', [
    // We remove the `transform` here completely, rather than setting it to zero, because:
    // 1. Having a transform can cause elements with ripples or an animated
    //    transform to shift around in Chrome with an RTL layout (see #10023).
    // 2. 3d transforms causes text to appear blurry on IE and Edge.
    state(
      'open, open-instant',
      style({
        transform: 'none',
        visibility: 'visible',
      }),
    ),
    state(
      'void',
      style({
        // Avoids the shadow showing up when closed in SSR.
        'box-shadow': 'none',
        visibility: 'hidden',
      }),
    ),
    transition('void => open-instant', animate('0ms')),
    transition(
      'void <=> open, open-instant => void',
      animate('300ms cubic-bezier(0.785, 0.135, 0.15, 0.86)'),
    ),
  ]),
};
