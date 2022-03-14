import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
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
    SbbRadioButtonModule,
    SbbNotificationModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class JourneyMapsClientExamplesModule {}
