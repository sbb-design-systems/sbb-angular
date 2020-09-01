import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sbb-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-chip',
    '[hidden]': 'this.ariaHidden === "true"',
    '[class.sbb-chip-disabled]': 'this.disabled',
    '[class.sbb-chip-active]': '!this.disabled',
    '[attr.aria-hidden]': 'this.ariaHidden',
  },
})
export class ChipComponent {
  /** The label to display on the chip. */
  @Input()
  label: string;

  /** Whether the chip is disabled. */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  /** Emits the current chip instance on dismissal. */
  @Output()
  dismissed: EventEmitter<ChipComponent> = new EventEmitter();

  /**
   * TODO: Refactor to _ariaHidden
   * @deprecated Internal detail only
   */
  ariaHidden: null | boolean | 'true';

  /** @deprecated Internal detail only */
  get hidden() {
    return this.ariaHidden === 'true';
  }

  /** @deprecated Internal detail only */
  get isDisabled() {
    return !!this.disabled;
  }

  /** @deprecated Internal detail only */
  get isActive() {
    return !this.disabled;
  }

  /**
   * Dismisses and hides this chip.
   */
  dismiss() {
    this.ariaHidden = 'true';
    this.dismissed.emit(this);
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
  // tslint:enable: member-ordering
}
