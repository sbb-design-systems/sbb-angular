import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-pseudo-checkbox',
  styleUrls: ['./option.component.css'],
  templateUrl: './pseudo-checkbox.html',
  host: {
    class: 'sbb-pseudo-checkbox',
    '[class.sbb-pseudo-checkbox-disabled]': 'this.disabled',
    '[class.sbb-pseudo-checkbox-checked]': 'this.state === "checked"',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbPseudoCheckbox {
  /** Display state of the checkbox. */
  @Input() state: 'unchecked' | 'checked' = 'unchecked';

  /** Whether the checkbox is disabled. */
  @Input() disabled = false;

  /** @deprecated */
  get checked(): boolean {
    return this.state === 'checked';
  }

  /** @deprecated */
  baseCssClass = true;
}
