import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbCheckbox } from './checkbox';
import { SbbCheckboxRequiredValidator } from './checkbox-required-validator';

@NgModule({
  imports: [ObserversModule, SbbCommonModule, SbbCheckbox, SbbCheckboxRequiredValidator],
  exports: [SbbCheckbox, SbbCheckboxRequiredValidator],
})
export class SbbCheckboxModule {}
