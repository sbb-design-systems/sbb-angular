import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'sbb-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input()
  label: string;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Output()
  dismissed: EventEmitter<ChipComponent> = new EventEmitter();

  @HostBinding('attr.aria-hidden') ariaHidden: null | boolean | 'true';

  @HostBinding('hidden')
  get hidden() {
    return this.ariaHidden === 'true';
  }

  @HostBinding('class.sbb-chip-disabled') get isDisabled() {
    return !!this.disabled;
  }

  @HostBinding('class.sbb-chip-active') get isActive() {
    return !this.disabled;
  }

  dismiss() {
    this.ariaHidden = 'true';
    this.dismissed.emit(this);
  }
}
