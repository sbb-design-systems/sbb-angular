import { Directive } from '@angular/core';

@Directive({
  selector: 'sbb-textexpand-collapsed',
  host: {
    class: 'sbb-textexpand-collapsed',
    '[attr.hidden]': '_hidden ? true : null',
  },
  standalone: true,
})
export class SbbTextexpandCollapsed {
  /** Describes if textexpand-collapsed is hidden or not. Initially it isn't hidden. */
  _hidden: boolean = false;
}
