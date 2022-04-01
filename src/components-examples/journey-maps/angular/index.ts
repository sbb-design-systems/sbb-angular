import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';
import { JourneyMapsClientModule } from '@sbb-esta/journey-maps/angular';

import { JourneyMapsBasicExample } from './journey-maps-basic/journey-maps-basic-example';
import { JourneyMapsFullExample } from './journey-maps-full/journey-maps-full-example';

export { JourneyMapsBasicExample, JourneyMapsFullExample };
const EXAMPLES = [JourneyMapsBasicExample, JourneyMapsFullExample];

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
    ReactiveFormsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class JourneyMapsClientExamplesModule {}
