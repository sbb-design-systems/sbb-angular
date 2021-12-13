import { ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbChip, SbbChipRemove, SbbChipTrailingIcon } from './chip';
import { SbbChipsDefaultOptions, SBB_CHIPS_DEFAULT_OPTIONS } from './chip-default-options';
import { SbbChipInput } from './chip-input';
import { SbbChipList } from './chip-list';

const CHIP_DECLARATIONS = [SbbChipList, SbbChip, SbbChipInput, SbbChipRemove, SbbChipTrailingIcon];

@NgModule({
  imports: [CommonModule, SbbCommonModule, SbbIconModule],
  exports: CHIP_DECLARATIONS,
  declarations: CHIP_DECLARATIONS,
  providers: [
    {
      provide: SBB_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER],
      } as SbbChipsDefaultOptions,
    },
  ],
})
export class SbbChipsModule {}
