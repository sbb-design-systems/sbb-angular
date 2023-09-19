import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbAttribution } from './components/attribution/attribution';
import { SbbBasemapSwitch } from './components/basemap-switch/basemap-switch';
import { SbbFeatureEventListener } from './components/feature-event-listener/feature-event-listener';
import { SbbGeolocateButton } from './components/geolocate-button/geolocate-button';
import { SbbHomeButton } from './components/home-button/home-button';
import { SbbLeitPoi } from './components/leit-poi/leit-poi';
import { SbbLevelSwitch } from './components/level-switch/level-switch';
import { SbbMarkerDetails } from './components/marker-details/marker-details';
import { SbbOverlayPaginator } from './components/overlay-paginator/overlay-paginator';
import { SbbPopup } from './components/popup/popup';
import { SbbTeaser } from './components/teaser/teaser';
import { SbbZoomControls } from './components/zoom-controls/zoom-controls';
import { SbbTemplateOutlet } from './directives/template-outlet';
import { SbbJourneyMaps } from './journey-maps';

@NgModule({
  declarations: [
    SbbJourneyMaps,
    SbbTeaser,
    SbbAttribution,
    SbbLevelSwitch,
    SbbZoomControls,
    SbbBasemapSwitch,
    SbbPopup,
    SbbMarkerDetails,
    SbbFeatureEventListener,
    SbbLeitPoi,
    SbbHomeButton,
    SbbGeolocateButton,
    SbbOverlayPaginator,
    SbbTemplateOutlet,
  ],
  imports: [CommonModule],
  exports: [SbbJourneyMaps],
})
export class SbbJourneyMapsModule {}
