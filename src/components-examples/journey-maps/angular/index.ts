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
import { JourneyMapsFeatureTypesExample } from './journey-maps-feature-types/journey-maps-feature-types-example';
import { JourneyMapsMapNavigationExample } from './journey-maps-map-navigation/journey-maps-map-navigation-example';
import { JourneyMapsPoisMarkersExample } from './journey-maps-pois-markers/journey-maps-pois-markers-example';
import { JourneyMapsStyleOptionsExample } from './journey-maps-style-options/journey-maps-style-options-example';
import { JourneyMapsUiOptionsExample } from './journey-maps-ui-options/journey-maps-ui-options-example';

export {
  JourneyMapsUiOptionsExample,
  JourneyMapsStyleOptionsExample,
  JourneyMapsMapNavigationExample,
  JourneyMapsPoisMarkersExample,
  JourneyMapsBasicExample,
  JourneyMapsFeatureTypesExample,
};
const EXAMPLES = [
  JourneyMapsUiOptionsExample,
  JourneyMapsStyleOptionsExample,
  JourneyMapsMapNavigationExample,
  JourneyMapsPoisMarkersExample,
  JourneyMapsBasicExample,
  JourneyMapsFeatureTypesExample,
];

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
    EXAMPLES,
  ],
  exports: EXAMPLES,
})
export class JourneyMapsClientExamplesModule {}
