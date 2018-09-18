import { NgModule } from '@angular/core';
import { IconHimConstructionComponent } from './sbb-icon-him-construction.component';
import { IconHimDisruptionComponent } from './sbb-icon-him-disruption.component';
import { IconHimInfoComponent } from './sbb-icon-him-info.component';
import { IconHimReplacementbusComponent } from './sbb-icon-him-replacementbus.component';

@NgModule({
  imports: [],
  // tslint:disable-next-line:max-line-length
  declarations: [IconHimConstructionComponent, IconHimDisruptionComponent, IconHimInfoComponent, IconHimReplacementbusComponent],
  // tslint:disable-next-line:max-line-length
  exports: [IconHimConstructionComponent, IconHimDisruptionComponent, IconHimInfoComponent, IconHimReplacementbusComponent],
  // tslint:disable-next-line:max-line-length
  entryComponents: [IconHimConstructionComponent, IconHimDisruptionComponent, IconHimInfoComponent, IconHimReplacementbusComponent]
})
export class IconHimModule { }
