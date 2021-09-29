import { Component, NgModule } from '@angular/core';
import { SbbTooltipModule } from '@sbb-esta/angular-business';

@Component({
  selector: 'sbb-tooltip-test',
  template: `
    <sbb-tooltip>
      <sbb-icon svgIcon="kom:download-small" *sbbIcon></sbb-icon>
      Test
    </sbb-tooltip>
    <sbb-tooltip>
      <sbb-icon [svgIcon]="icon" *sbbIcon></sbb-icon>
      Test
    </sbb-tooltip>
    <sbb-tooltip>
      <sbb-icon-something class="test" *sbbIcon></sbb-icon-something>
    </sbb-tooltip>
    <sbb-tooltip [icon]="icon">Description</sbb-tooltip>
    <ng-template #icon><sbb-icon [svgIcon]="icon"></sbb-icon></ng-template>
  `,
})
export class TooltipTestComponent {}

@NgModule({
  declarations: [TooltipTestComponent],
  imports: [SbbTooltipModule],
})
export class TooltipTestModule {}
