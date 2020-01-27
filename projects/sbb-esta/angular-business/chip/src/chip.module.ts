import { NgModule } from '@angular/core';
import { IconCrossModule } from '@sbb-esta/angular-icons';

import { ChipComponent } from './chip/chip.component';

@NgModule({
  declarations: [ChipComponent],
  imports: [IconCrossModule],
  exports: [ChipComponent]
})
export class ChipModule {}
