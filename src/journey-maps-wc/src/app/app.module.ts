import { HttpClientModule } from '@angular/common/http';
import {
  ApplicationRef,
  CUSTOM_ELEMENTS_SCHEMA,
  DoBootstrap,
  Injector,
  NgModule,
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SbbJourneyMaps, SbbJourneyMapsModule } from '@sbb-esta/journey-maps/angular';

@NgModule({
  imports: [HttpClientModule, BrowserAnimationsModule, SbbJourneyMapsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule implements DoBootstrap {
  constructor(private _injector: Injector) {}

  ngDoBootstrap(appRef: ApplicationRef): void {
    const element = createCustomElement(SbbJourneyMaps, { injector: this._injector });
    customElements.define('sbb-journey-maps-wc', element);
  }
}
