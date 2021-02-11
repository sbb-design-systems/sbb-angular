import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-pseudo-checkbox',
  templateUrl: './pseudo-checkbox.html',
  host: {
    class: 'sbb-pseudo-checkbox',
    '[class.sbb-selection-disabled]': 'this.disabled',
    '[class.sbb-selection-checked]': 'this.state === "checked"',
    '[class.sbb-selection-indeterminate]': 'this.state === "indeterminate"',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbPseudoCheckbox {
  /** Display state of the checkbox. */
  @Input() state: 'unchecked' | 'checked' | 'indeterminate' = 'unchecked';

  /** Whether the checkbox is disabled. */
  @Input() disabled: boolean = false;
}
