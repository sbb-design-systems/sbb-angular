import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import './bootstrap/bootstrap';

platformBrowser()
  .bootstrapModule(AppModule, { ngZone: 'noop' })
  .catch((err) => console.log(err));
