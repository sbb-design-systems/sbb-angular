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
  disabled = false;

  @Output()
  dismissed: EventEmitter<boolean> = new EventEmitter();

  @HostBinding('attr.aria-hidden') ariaHidden: 'false' | 'true';

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
    this.dismissed.emit(false);
  }
}
