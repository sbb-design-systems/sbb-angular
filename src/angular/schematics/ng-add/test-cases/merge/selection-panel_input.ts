import { Component, NgModule } from '@angular/core';
import { SbbCheckboxPanelModule } from '@sbb-esta/angular-public';

@Component({
  selector: 'sbb-panel-test',
  template: `
    <sbb-checkbox-panel [(ngModel)]="option.selected" [value]="option.value" [label]="option.name"></sbb-checkbox-panel>
    <sbb-checkbox-panel
      name="single-option"
      value="single-option"
      [checked]="checked2"
      label="SBB - Finanzen"
      subtitle="Armin Burgermeister"
    ></sbb-checkbox-panel>
    <sbb-checkbox-panel
      name="single-option"
      value="single-option"
      [checked]="checked2"
      label="SBB - Finanzen"
      [subtitle]="test"
    >
      <sbb-icon svgIcon="kom:heart-small" sbbIcon></sbb-icon>
    </sbb-checkbox-panel>
  `,
})
export class PanelTestComponent {}

@NgModule({
  declarations: [PanelTestComponent],
  imports: [SbbCheckboxPanelModule],
})
export class PanelTestModule {}
