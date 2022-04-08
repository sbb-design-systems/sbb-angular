import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';
import { SbbJourneyMapsModule } from '@sbb-esta/journey-maps';

import { JourneyMapsBasicExample } from './journey-maps-basic/journey-maps-basic-example';
import { JourneyMapsFullExample } from './journey-maps-full/journey-maps-full-example';

export { JourneyMapsBasicExample, JourneyMapsFullExample };
const EXAMPLES = [JourneyMapsBasicExample, JourneyMapsFullExample];

@NgModule({
  imports: [
    CommonModule,
    SbbJourneyMapsModule,
    SbbButtonModule,
    SbbInputModule,
    SbbCheckboxModule,
    SbbRadioButtonModule,
    SbbNotificationModule,
    FormsModule,
    SbbTabsModule,
    ReactiveFormsModule,
    SbbSelectModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class JourneyMapsClientExamplesModule {}
