import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { sbbSortAnimations } from './sort-animations';

/**
 * This is a modified version of the sbb kom:arrow-down-small icon to support the animation
 */
@Component({
  selector: 'sbb-sort-arrow',
  template: ` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
  >
    <path
      fill="none"
      fill-rule="evenodd"
      stroke="#000"
      stroke-width="1"
      d="M11.5,5.75 L11.5,18.25"
    ></path>
    <path
      fill="none"
      fill-rule="evenodd"
      stroke="#000"
      stroke-width="1"
      d="M7.5,14.25 L11.5,18.25 L15.5,14.25"
      style="transform-origin: center"
      [@indicator]="arrowDirectionState"
    ></path>
  </svg>`,
  exportAs: 'sbbSortArrow',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sbbSortAnimations.indicator],
})
/** @docs-private */
export class SbbSortArrow {
  @Input() arrowDirectionState: string;
}
