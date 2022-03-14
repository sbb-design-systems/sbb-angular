import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { JourneyMapsClientModule } from '@sbb-esta/journey-maps/angular';

import { Angular } from './angular/angular-example';

export { Angular };
const EXAMPLES = [Angular];

@NgModule({
  imports: [
    CommonModule,
    JourneyMapsClientModule,
    SbbButtonModule,
    SbbInputModule,
    SbbCheckboxModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class JourneyMapsClientExamplesModule {}
