import { Component, HostBinding, Input } from '@angular/core';

let uniqueOptgroupIdCounter = 0;

@Component({
  selector: 'sbb-option-group',
  exportAs: 'sbbOptgroup',
  templateUrl: './option-group.component.html',
  styleUrls: ['./option-group.component.css']
})
export class OptionGroupComponent {
  @HostBinding('class.sbb-optgroup')
  optGroupClass = true;

  @HostBinding('attr.role')
  role = 'group';

  @Input()
  @HostBinding('class.sbb-optgroup-disabled')
  @HostBinding('attr.aria-disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled = false;

  @HostBinding('attr.aria-labelledby')
  get isLabelledBy() {
    return this.labelId;
  }

  @Input() label: string;

  labelId = `sbb-optgroup-label-${uniqueOptgroupIdCounter++}`;
}
