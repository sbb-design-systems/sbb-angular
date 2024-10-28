import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Inject,
  InjectionToken,
  Input,
  Optional,
  ViewEncapsulation,
} from '@angular/core';

import { SbbOptionParentComponent, SBB_OPTION_PARENT_COMPONENT } from './option-parent';

// Notes on the accessibility pattern used for `sbb-optgroup`.
// The option group has two different "modes": regular and inert. The regular mode uses the
// recommended a11y pattern which has `role="group"` on the group element with `aria-labelledby`
// pointing to the label. This works for `sbb-select`, but it seems to hit a bug for autocomplete
// under VoiceOver where the group doesn't get read out at all. The bug appears to be that if
// there's __any__ a11y-related attribute on the group (e.g. `role` or `aria-labelledby`),
// VoiceOver on Safari won't read it out.
// We've introduced the `inert` mode as a workaround. Under this mode, all a11y attributes are
// removed from the group, and we get the screen reader to read out the group label by mirroring it
// inside an invisible element in the option. This is sub-optimal, because the screen reader will
// repeat the group label on each navigation, whereas the default pattern only reads the group when
// the user enters a new group. The following alternate approaches were considered:
// 1. Reading out the group label using the `LiveAnnouncer` solves the problem, but we can't control
//    when the text will be read out so sometimes it comes in too late or never if the user
//    navigates quickly.
// 2. `<sbb-option aria-describedby="groupLabel"` - This works on Safari, but VoiceOver in Chrome
//    won't read out the description at all.
// 3. `<sbb-option aria-labelledby="optionLabel groupLabel"` - This works on Chrome, but Safari
//     doesn't read out the text at all. Furthermore, on

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
    '[attr.role]': '_inert ? null : "group"',
    '[attr.aria-disabled]': '_inert ? null : disabled.toString()',
    '[attr.aria-labelledby]': '_inert ? null : _labelId',
    '[class.sbb-disabled]': 'disabled',
  },
  providers: [{ provide: SBB_OPTGROUP, useExisting: SbbOptgroup }],
  standalone: true,
})
export class SbbOptgroup {
  /** Label for the option group. */
  @Input() label: string;

  /** Whether the group is disabled. */
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  /** Unique id for the underlying label. */
  _labelId: string = `sbb-optgroup-label-${uniqueOptgroupIdCounter++}`;

  /** Whether the group is in inert a11y mode. */
  _inert: boolean;

  constructor(@Inject(SBB_OPTION_PARENT_COMPONENT) @Optional() parent?: SbbOptionParentComponent) {
    this._inert = parent?.inertGroups ?? false;
  }
}
