/** Time and timing curve for expansion panel animations. */
// Note: Keep this in sync with the Sass variable for the panel header animation.
export const SBB_EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/**
 * Animations used by the Material expansion panel.
 *
 * A bug in angular animation's `state` when ViewContainers are moved using ViewContainerRef.move()
 * causes the animation state of moved components to become `void` upon exit, and not update again
 * upon reentry into the DOM.  This can lead a to situation for the expansion panel where the state
 * of the panel is `expanded` or `collapsed` but the animation state is `void`.
 *
 * To correctly handle animating to the next state, we animate between `void` and `collapsed` which
 * are defined to have the same styles. Since angular animates from the current styles to the
 * destination state's style definition, in situations where we are moving from `void`'s styles to
 * `collapsed` this acts a noop since no style values change.
 *
 * In the case where angular's animation state is out of sync with the expansion panel's state, the
 * expansion panel being `expanded` and angular animations being `void`, the animation from the
 * `expanded`'s effective styles (though in a `void` animation state) to the collapsed state will
 * occur as expected.
 *
 * Angular Bug: https://github.com/angular/angular/issues/18847
 *
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
export const sbbExpansionAnimations: {
  readonly indicatorRotate: any;
  readonly bodyExpansion: any;
} = {
  // Represents:
  // trigger('indicatorRotate', [
  //   state('collapsed, void', style({ transform: 'rotate(90deg)' })),
  //   state('expanded', style({ transform: 'rotate(-90deg)' })),
  //   transition(
  //     'expanded <=> collapsed, void => collapsed',
  //     animate(SBB_EXPANSION_PANEL_ANIMATION_TIMING),
  //   ),
  // ]),

  /** Animation that rotates the indicator arrow. */
  indicatorRotate: {
    type: 7,
    name: 'indicatorRotate',
    definitions: [
      {
        type: 0,
        name: 'collapsed, void',
        styles: { type: 6, styles: { transform: 'rotate(90deg)', offset: null } },
      },
      {
        type: 0,
        name: 'expanded',
        styles: { type: 6, styles: { transform: 'rotate(-90deg)', offset: null } },
      },
      {
        type: 1,
        expr: 'expanded <=> collapsed, void => collapsed',
        animation: { type: 4, timings: 'cubic-bezier(0.4,0.0,0.2,1)' },
        options: null,
      },
    ],
    options: {},
  },

  // Represents:
  // trigger('bodyExpansion', [
  //   state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
  //   // Clear the `visibility` while open, otherwise the content will be visible when placed in
  //   // a parent that's `visibility: hidden`, because `visibility` doesn't apply to descendants
  //   // that have a `visibility` of their own (see #27436).
  //   state('expanded', style({ height: '*', visibility: '' })),
  //   transition(
  //     'expanded <=> collapsed, void => collapsed',
  //     animate(SBB_EXPANSION_PANEL_ANIMATION_TIMING),
  //   ),
  // ]),

  bodyExpansion: {
    type: 7,
    name: 'bodyExpansion',
    definitions: [
      {
        type: 0,
        name: 'collapsed, void',
        styles: { type: 6, styles: { height: '0px', visibility: 'hidden' }, offset: null },
      },
      {
        type: 0,
        name: 'expanded',
        styles: { type: 6, styles: { height: '*', visibility: '' }, offset: null },
      },
      {
        type: 1,
        expr: 'expanded <=> collapsed, void => collapsed',
        animation: { type: 4, timings: SBB_EXPANSION_PANEL_ANIMATION_TIMING },
        options: null,
      },
    ],
    options: {},
  },
};
