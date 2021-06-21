import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

/**
 * Animations used by the SBB tabs.
 * @docs-private
 */
export const sbbTabsAnimations: {
  readonly translateTab: AnimationTriggerMetadata;
} = {
  translateTab: trigger('translateTab', [
    transition('* => void, * => hidden', [
      style({ opacity: 1 }),
      animate('150ms ease', style({ opacity: 0 })),
    ]),
    transition('hidden => show', [
      style({ opacity: 0 }),
      animate('1500ms ease', style({ opacity: 1 })),
    ]),
    transition('void => show', animate('0s')),
  ]),
};
