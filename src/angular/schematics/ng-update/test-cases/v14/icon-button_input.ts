import { Component, NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';

@Component({
  selector: 'sbb-button-test',
  template: `
    <button sbb-icon-button><sbb-icon svgIcon="kom:house-small"></sbb-icon></button>
    <button sbb-icon-button><sbb-icon svgIcon="kom:network-medium"></sbb-icon></button>
  `,
})
export class ButtonTestComponent {}

@NgModule({
  declarations: [ButtonTestComponent],
  imports: [SbbButtonModule, SbbIconModule],
})
export class ButtonTestModule {}
