import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';
import { JourneyMapsClientModule } from '@sbb-esta/journey-maps/angular';

import { JourneyMapsAngularVariant } from './journey-maps-angular-variant/journey-maps-angular-variant-example';

export { JourneyMapsAngularVariant };
const EXAMPLES = [JourneyMapsAngularVariant];

@NgModule({
  imports: [
    CommonModule,
    JourneyMapsClientModule,
    SbbButtonModule,
    SbbInputModule,
    SbbCheckboxModule,
    SbbRadioButtonModule,
    SbbNotificationModule,
    FormsModule,
    SbbTabsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class JourneyMapsClientExamplesModule {}
