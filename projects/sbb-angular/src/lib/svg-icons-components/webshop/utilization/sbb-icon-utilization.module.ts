import { NgModule } from '@angular/core';
import { IconUtilizationHighComponent } from './sbb-icon-utilization-high.component';
import { IconUtilizationLowComponent } from './sbb-icon-utilization-low.component';
import { IconUtilizationMediumComponent } from './sbb-icon-utilization-medium.component';

@NgModule({
  imports: [],
  // tslint:disable-next-line:max-line-length
  declarations: [IconUtilizationHighComponent, IconUtilizationLowComponent, IconUtilizationMediumComponent],
  // tslint:disable-next-line:max-line-length
  exports: [IconUtilizationHighComponent, IconUtilizationLowComponent, IconUtilizationMediumComponent],
  // tslint:disable-next-line:max-line-length
  entryComponents: [IconUtilizationHighComponent, IconUtilizationLowComponent, IconUtilizationMediumComponent]
})
export class IconUtilizationModule { }
