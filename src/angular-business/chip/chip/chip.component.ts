import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'sbb-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-chip',
    '[hidden]': 'this._ariaHidden === "true"',
    '[class.sbb-chip-disabled]': 'this.disabled',
    '[class.sbb-chip-active]': '!this.disabled',
    '[attr.aria-hidden]': 'this._ariaHidden',
  },
})
export class SbbChip {
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
  dismissed: EventEmitter<SbbChip> = new EventEmitter();

  _ariaHidden: null | 'true' = null;

  /** Dismisses and hides this chip. */
  dismiss() {
    this._ariaHidden = 'true';
    this.dismissed.emit(this);
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
  // tslint:enable: member-ordering
}
