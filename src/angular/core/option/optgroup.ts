import { BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { CanDisable, CanDisableCtor, mixinDisabled } from '../common-behaviors/disabled';

// Boilerplate for applying mixins to SbbOptgroup.
/** @docs-private */
class SbbOptgroupBase {}
// tslint:disable-next-line: naming-convention
const _SbbOptgroupMixinBase: CanDisableCtor & typeof SbbOptgroupBase = mixinDisabled(
  SbbOptgroupBase
);

// Counter for unique group ids.
let uniqueOptgroupIdCounter = 0;

/**
 * Injection token that can be used to reference instances of `SbbOptgroup`. It serves as
 * alternative token to the actual `SbbOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const SBB_OPTGROUP = new InjectionToken<SbbOptgroup>('SbbOptgroup');

@Component({
  selector: 'sbb-optgroup',
  exportAs: 'sbbOptgroup',
  templateUrl: './optgroup.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  host: {
    class: 'sbb-optgroup sbb-menu-group',
    role: 'group',
    '[class.sbb-optgroup-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-labelledby]': '_labelId',
  },
  providers: [{ provide: SBB_OPTGROUP, useExisting: SbbOptgroup }],
})
export class SbbOptgroup extends _SbbOptgroupMixinBase implements CanDisable {
  /** Label for the option group. */
  @Input() label: string;

  /** Unique id for the underlying label. */
  _labelId: string = `sbb-optgroup-label-${uniqueOptgroupIdCounter++}`;

  static ngAcceptInputType_disabled: BooleanInput;
}
