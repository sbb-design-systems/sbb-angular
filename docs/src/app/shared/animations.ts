import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const ROUTER_ANIMATION: AnimationTriggerMetadata = trigger('animRoutes', [
  transition('* <=> *', [
    group([
      query(
        ':enter',
        [
          style({ opacity: 0, position: 'absolute' }),
          animate(350, style({ opacity: 1 })),
          animateChild(),
        ],
        { optional: true },
      ),
      query(
        ':leave',
        [
          style({ opacity: 1, position: 'absolute' }),
          animate(300, style({ opacity: 0 })),
          animateChild(),
        ],
        { optional: true },
      ),
    ]),
  ]),
]);
