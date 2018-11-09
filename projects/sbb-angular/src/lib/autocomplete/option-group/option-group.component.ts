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
  optGroupClass: boolean = true;

  @HostBinding('attr.role')
  role: string = 'group';

  @HostBinding('class.sbb-optgroup-disabled')
  disabled: boolean = false;

  @HostBinding('attr.aria-disabled')
  get isDisabled() { return this.disabled; }

  @HostBinding('attr.aria-labelledby')
  get isLabelledBy() { return this.labelId; }

  @Input() label: string;

  labelId: string = `sbb-optgroup-label-${uniqueOptgroupIdCounter++}`;

}
