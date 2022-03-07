import {NgModule} from '@angular/core';
import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {CommonModule} from '@angular/common';
import {AngularResizeEventModule} from 'angular-resize-event';
import {GlobalStylesComponent} from './components/global-styles/global-styles.component';
import {MarkerDetailsComponent} from './components/marker-details/marker-details.component';
import {LevelSwitchComponent} from './components/level-switch/level-switch.component';
import {PopupComponent} from './components/popup/popup.component';
import {TeaserComponent} from './components/teaser/teaser.component';
import {ZoomControlsComponent} from './components/zoom-controls/zoom-controls.component';
import {LeitPoiComponent} from './components/leit-poi/leit-poi.component';
import {BasemapSwitchComponent} from './components/basemap-switch/basemap-switch.component';
import {HomeButtonComponent} from './components/home-button/home-button.component';
import {FeatureEventListenerComponent} from './components/feature-event-listener/feature-event-listener.component';
import {OverlayPaginatorComponent} from './components/overlay-paginator/overlay-paginator.component';

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
  imports: [
    CommonModule,
    AngularResizeEventModule,
  ],
  exports: [
    JourneyMapsClientComponent,
    PopupComponent,
    TeaserComponent
  ],
})
export class JourneyMapsClientModule {
}
