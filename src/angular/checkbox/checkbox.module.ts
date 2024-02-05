import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbCheckbox } from './checkbox';

@NgModule({
  imports: [ObserversModule, SbbCommonModule, SbbCheckbox],
  exports: [SbbCheckbox],
})
export class SbbCheckboxModule {}
