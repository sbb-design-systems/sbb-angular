import { Component, HostBinding, Input } from '@angular/core';

let uniqueOptgroupIdCounter = 0;

@Component({
  selector: 'sbb-option-group',
  exportAs: 'sbbOptgroup',
  templateUrl: './option-group.component.html',
  styleUrls: ['./option-group.component.scss']
})
export class OptionGroupComponent {

  @HostBinding('class.sbb-optgroup')
  optGroupClass = true;

  @HostBinding('attr.role')
  role = 'group';

  @HostBinding('class.sbb-optgroup-disabled')
  disabled = false;

  @HostBinding('attr.aria-disabled')
  get isDisabled() { return this.disabled; }

  @HostBinding('attr.aria-labelledby')
  get isLabelledBy() { return this.labelId; }

  @Input() label: string;

  labelId = `sbb-optgroup-label-${uniqueOptgroupIdCounter++}`;

}
