import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbChipInput } from '@sbb-esta/angular-business/chip';
import { SbbFormFieldControl } from '@sbb-esta/angular-core/forms';

@Component({
  selector: 'sbb-chip-input-extended',
  templateUrl: './chip-input-extended.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: SbbFormFieldControl, useExisting: SbbChipInputExtended }],
})
export class SbbChipInputExtended extends SbbChipInput {
  inputControl = new FormControl('');
}
