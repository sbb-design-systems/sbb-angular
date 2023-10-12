// tslint:disable:ordered-imports
import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { SbbJourneyMapsCustomElementModule } from './journey-maps-web-component.module';

enableProdMode();

platformBrowser()
  .bootstrapModule(SbbJourneyMapsCustomElementModule, { ngZone: 'noop' })
  .catch((err) => console.error(err));
