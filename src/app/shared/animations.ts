import {
  trigger,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({opacity:0}),
    animate(600, style({opacity:1}))
  ]),
  transition(':leave', [
    style({transform: 'translate(0)'}),
    animate(600, style({opacity:0}))
  ])
]);

export const slideAnimation = trigger('slideAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate(400, keyframes([
      style({ opacity: 0, offset: 0 }),
      style({ opacity: 0.3, transform: 'translateX(15%)', offset: 0.8 }),
      style({ opacity: 0.9, transform: 'translateX(-2%)', offset: 0.9 }),
      style({ opacity: 1, transform: 'translateX(0)' , offset: 1 })
    ]))
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'translateX(0)' }),
    animate(400, keyframes([
      style({ opacity: 1, offset: 0 }),
      style({ opacity: 0.9, transform: 'translateX(-2%)', offset: 0.8 }),
      style({ opacity: 0.3, transform: 'translateX(-15%)', offset: 0.9 }),
      style({ opacity: 0, transform: 'translateX(0)' , offset: 1 })
    ]))
  ])
]);
