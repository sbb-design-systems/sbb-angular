import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BasemapSwitchComponent } from './components/basemap-switch/basemap-switch.component';
import { FeatureEventListenerComponent } from './components/feature-event-listener/feature-event-listener.component';
import { GlobalStylesComponent } from './components/global-styles/global-styles.component';
import { HomeButtonComponent } from './components/home-button/home-button.component';
import { LeitPoiComponent } from './components/leit-poi/leit-poi.component';
import { LevelSwitchComponent } from './components/level-switch/level-switch.component';
import { MarkerDetailsComponent } from './components/marker-details/marker-details.component';
import { OverlayPaginatorComponent } from './components/overlay-paginator/overlay-paginator.component';
import { PopupComponent } from './components/popup/popup.component';
import { TeaserComponent } from './components/teaser/teaser.component';
import { ZoomControlsComponent } from './components/zoom-controls/zoom-controls.component';
import { JourneyMapsClientComponent } from './journey-maps-client.component';

@NgModule({
  declarations: [
    JourneyMapsClientComponent,
    TeaserComponent,
    GlobalStylesComponent,
    LevelSwitchComponent,
    ZoomControlsComponent,
    BasemapSwitchComponent,
    PopupComponent,
    MarkerDetailsComponent,
    FeatureEventListenerComponent,
    LeitPoiComponent,
    HomeButtonComponent,
    OverlayPaginatorComponent,
  ],
  imports: [CommonModule],
  exports: [JourneyMapsClientComponent],
})
export class JourneyMapsClientModule {}
