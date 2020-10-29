import { BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CanDisable, CanDisableCtor, mixinDisabled } from '@sbb-esta/angular-core/common-behaviors';

// Boilerplate for applying mixins to SbbOptionGroup.
/** @docs-private */
class SbbOptgroupBase {}
// tslint:disable-next-line: naming-convention
const _SbbOptgroupMixinBase: CanDisableCtor & typeof SbbOptgroupBase = mixinDisabled(
  SbbOptgroupBase
);

// Counter for unique group ids.
let uniqueOptgroupIdCounter = 0;

/**
 * Injection token that can be used to reference instances of `SbbOptionGroup`. It serves as
 * alternative token to the actual `SbbOptionGroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const SBB_OPTGROUP = new InjectionToken<SbbOptionGroup>('SbbOptionGroup');

@Component({
  selector: 'sbb-option-group',
  exportAs: 'sbbOptgroup',
  templateUrl: './option-group.component.html',
  styleUrls: ['./option-group.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  host: {
    class: 'sbb-optgroup',
    role: 'group',
    '[class.sbb-optgroup-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-labelledby]': '_labelId',
  },
  providers: [{ provide: SBB_OPTGROUP, useExisting: SbbOptionGroup }],
})
export class SbbOptionGroup extends _SbbOptgroupMixinBase implements CanDisable {
  /** Label for the option group. */
  @Input() label: string;

  /** Unique id for the underlying label. */
  _labelId: string = `sbb-optgroup-label-${uniqueOptgroupIdCounter++}`;

  // tslint:disable-next-line: member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
}
