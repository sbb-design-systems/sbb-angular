import { Component, NgModule } from '@angular/core';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

@Component({
  selector: 'sbb-tooltip-test',
  template: `
    <sbb-tooltip indicatorIcon="kom:download-small">
      
      Test
    </sbb-tooltip>
    <sbb-tooltip [indicatorIcon]="icon">
      
      Test
    </sbb-tooltip>
    <sbb-tooltip><!-- TODO: Unable to determine custom icon from "<sbb-icon-something>". Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/tooltip -->
      
    </sbb-tooltip>
    <sbb-tooltip><!-- TODO: Unable to determine custom icon from icon "icon". Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/tooltip -->Description</sbb-tooltip>
    <ng-template #icon><sbb-icon [svgIcon]="icon"></sbb-icon></ng-template>
  `,
})
export class TooltipTestComponent {}

@NgModule({
  declarations: [TooltipTestComponent],
  imports: [SbbTooltipModule],
})
export class TooltipTestModule {}
