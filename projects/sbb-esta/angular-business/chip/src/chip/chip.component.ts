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
  dismissed: EventEmitter<boolean> = new EventEmitter();

  @HostBinding('hidden') hidden: 'false' | 'true';

  @HostBinding('attr.aria-hidden')
  get ariaHidden() {
    return this.hidden === 'true';
  }

  @HostBinding('class.sbb-chip-disabled') get isDisabled() {
    return !!this.disabled;
  }

  @HostBinding('class.sbb-chip-active') get isActive() {
    return !this.disabled;
  }

  dismiss() {
    this.hidden = 'true';
    this.dismissed.emit(false);
  }
}
