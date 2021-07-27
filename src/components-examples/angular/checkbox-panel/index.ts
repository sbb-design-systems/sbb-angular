import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbCheckboxPanelModule } from '@sbb-esta/angular/checkbox-panel';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbSelectModule } from '@sbb-esta/angular/select';

import { CheckboxPanelContentExample } from './checkbox-panel-content/checkbox-panel-content-example';
import { CheckboxPanelGroupExample } from './checkbox-panel-group/checkbox-panel-group-example';
import { CheckboxPanelIconExample } from './checkbox-panel-icon/checkbox-panel-icon-example';
import { CheckboxPanelSimpleExample } from './checkbox-panel-simple/checkbox-panel-simple-example';

export {
  CheckboxPanelSimpleExample,
  CheckboxPanelContentExample,
  CheckboxPanelGroupExample,
  CheckboxPanelIconExample,
};

const EXAMPLES = [
  CheckboxPanelSimpleExample,
  CheckboxPanelContentExample,
  CheckboxPanelGroupExample,
  CheckboxPanelIconExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbInputModule,
    SbbIconModule,
    SbbCheckboxModule,
    SbbCheckboxPanelModule,
    SbbSelectModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class CheckboxPanelExamplesModule {}
