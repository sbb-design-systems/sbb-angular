import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Animations used by the sbb-menu component.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
export const sbbMenuAnimations: {
  readonly transformMenu: AnimationTriggerMetadata;
} = {
  /**
   * This animation controls the menu panel's entry and exit from the page.
   *
   * When the menu panel is added to the DOM, it fades in.
   *
   * When the menu panel is removed from the DOM, it fades out.
   */
  transformMenu: trigger('transformMenu', [
    state(
      'void',
      style({
        opacity: 0,
      }),
    ),
    state(
      'enter-usermenu',
      style({
        width: '{{width}}',
        maxHeight: '100%',
      }),
      { params: { width: '288px' } },
    ),
    transition(
      'void => enter',
      animate(
        '120ms cubic-bezier(0, 0, 0.2, 1)',
        style({
          opacity: 1,
        }),
      ),
    ),
    transition('enter => void', animate('100ms linear', style({ opacity: 0 }))),
    transition(
      'void => enter-usermenu',
      animate(
        '300ms cubic-bezier(.785,.135,.15,.86)',
        keyframes([
          style({
            width: 'var(--sbb-menu-trigger-width)',
            height: 'var(--sbb-menu-trigger-height)',
            offset: 0,
          }),
          style({
            width: '{{width}}',
            height: '*',
            opacity: 1,
            maxHeight: '100%',
            offset: 1,
          }),
        ]),
      ),
    ),
    transition(
      'enter-usermenu => void',
      animate(
        '300ms cubic-bezier(.785,.135,.15,.86)',
        style({
          opacity: 0,
          width: 'var(--sbb-menu-trigger-width)',
          height: 'var(--sbb-menu-trigger-height)',
        }),
      ),
    ),
  ]),
};
