// tslint:disable:ordered-imports
import 'zone.js/dist/zone';
import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { SbbJourneyMapsCustomElementModule } from './journey-maps-web-component.module';

enableProdMode();

platformBrowser()
  .bootstrapModule(SbbJourneyMapsCustomElementModule)
  .catch((err) => console.error(err));
