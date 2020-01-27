import { Component, HostBinding, Input } from '@angular/core';

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

  @HostBinding('class.sbb-chip-disabled') get isDisabled() {
    return !!this.disabled;
  }

  @HostBinding('class.sbb-chip-active') get isActive() {
    return !this.disabled;
  }
}
