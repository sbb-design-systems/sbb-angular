import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbAutocompleteModule } from '@sbb-esta/angular-business/autocomplete';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbChipInput } from './chip-input/chip-input.component';
import { SbbChip } from './chip/chip.component';

@NgModule({
  declarations: [SbbChip, SbbChipInput],
  imports: [SbbIconModule, SbbAutocompleteModule, CommonModule],
  exports: [SbbChipInput, SbbChip],
})
export class SbbChipModule {}
