import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';

import { SbbCheckboxRequiredValidator } from './checkbox-required-validator';
import { SbbCheckbox } from './checkbox.component';

@NgModule({
  imports: [ObserversModule],
  declarations: [SbbCheckbox, SbbCheckboxRequiredValidator],
  exports: [SbbCheckbox, SbbCheckboxRequiredValidator],
})
export class SbbCheckboxModule {}
