import { Component, NgModule } from '@angular/core';
import { SbbCheckboxPanelModule } from '@sbb-esta/angular/checkbox-panel';

@Component({
  selector: 'sbb-panel-test',
  template: `
    <sbb-checkbox-panel [(ngModel)]="option.selected" [value]="option.value">{{ option.name }}</sbb-checkbox-panel>
    <sbb-checkbox-panel
      name="single-option"
      value="single-option"
      [checked]="checked2"
      i18n="desc@@id"
     
     
     
    >SBB - Finanzen<sbb-checkbox-panel-subtitle i18n="desc@@id">Armin Burgermeister</sbb-checkbox-panel-subtitle></sbb-checkbox-panel>
    <sbb-checkbox-panel
      name="single-option"
      value="single-option"
      [checked]="checked2"
      i18n="desc@@id"
     
     
    >SBB - Finanzen<sbb-checkbox-panel-subtitle>{{ test }}</sbb-checkbox-panel-subtitle>
      <sbb-checkbox-panel-note><sbb-icon svgIcon="kom:heart-small"></sbb-icon></sbb-checkbox-panel-note>
    </sbb-checkbox-panel>
  `,
})
export class PanelTestComponent {}

@NgModule({
  declarations: [PanelTestComponent],
  imports: [SbbCheckboxPanelModule],
})
export class PanelTestModule {}
