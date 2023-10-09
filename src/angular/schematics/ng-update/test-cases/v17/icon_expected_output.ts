import { Component, NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';

@Component({
  selector: 'sbb-icon-test',
  template: `
    <button sbb-button><sbb-icon svgIcon="house-small"></sbb-icon></button>
    <button sbb-secondary-button><sbb-icon svgIcon="network-medium"></sbb-icon></button>
    <sbb-icon *ngFor="let iconName of moreIconNames" [svgIcon]="iconName"></sbb-icon>
    <div>kom:something-else-than-an-icon</div>
  `,
})
export class ButtonTestComponent {
  moreIconNames: string[] = [
    'waves-ladder-large',
    'tgv',
    'battery-level-low-large',
    'double-chevron-small-right-medium',
  ];
}

@NgModule({
  declarations: [ButtonTestComponent],
  imports: [SbbButtonModule, SbbIconModule],
})
export class ButtonTestModule {}
