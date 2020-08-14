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
 */
export const sbbIconSidebarAnimations: {
  readonly transformIconSidebar: AnimationTriggerMetadata;
} = {
  /** Animation that slides a sidebar in and out. */
  transformIconSidebar: trigger('width', [
    // We remove the `transform` here completely, rather than setting it to zero, because:
    // 1. Having a transform can cause elements with ripples or an animated
    //    transform to shift around in Chrome with an RTL layout (see #10023).
    // 2. 3d transforms causes text to appear blurry on IE and Edge.
    state(
      'expanded, expanded-instant',
      style({
        width: '{{expandedWidth}}',
      }),
      { params: { expandedWidth: '250px' } }
    ),
    state(
      'void',
      style({
        width: '48px',
      })
    ),
    state(
      'mobile',
      style({
        width: '100%',
      })
    ),
    transition('void => expanded-instant, * <=> mobile', animate('0ms')),
    transition(
      'void <=> expanded, expanded-instant => void',
      animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
    ),
  ]),
};
