import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconHeartModule } from '@sbb-esta/angular-icons/basic';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { CheckboxPanelModule } from '@sbb-esta/angular-public/checkbox-panel';

import { provideExamples } from '../../../shared/example-provider';

import { CheckboxPanelGroupExampleComponent } from './checkbox-panel-group-example/checkbox-panel-group-example.component';
import { CheckboxPanelIconExampleComponent } from './checkbox-panel-icon-example/checkbox-panel-icon-example.component';
import { CheckboxPanelImgExampleComponent } from './checkbox-panel-img-example/checkbox-panel-img-example.component';

const EXAMPLES = [
  CheckboxPanelIconExampleComponent,
  CheckboxPanelImgExampleComponent,
  CheckboxPanelGroupExampleComponent,
];

const EXAMPLE_INDEX = {
  'checkbox-panel-img-example': CheckboxPanelImgExampleComponent,
  'checkbox-panel-icon-example': CheckboxPanelIconExampleComponent,
  'checkbox-panel-group-example': CheckboxPanelGroupExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconHeartModule,
    CheckboxModule,
    CheckboxPanelModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'checkbox-panel', EXAMPLE_INDEX)],
})
export class CheckboxPanelExamplesModule {}
