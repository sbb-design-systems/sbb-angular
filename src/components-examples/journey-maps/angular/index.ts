import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JourneyMapsClientModule } from '@sbb-esta/journey-maps/angular';

import { Angular } from './angular/angular-example';

export { Angular };
const EXAMPLES = [Angular];

@NgModule({
  imports: [CommonModule, JourneyMapsClientModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class EsriLegendExamplesModule {}
