import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbLinksModule } from '@sbb-esta/angular-public/links';
import { SbbTooltipModule } from '@sbb-esta/angular-public/tooltip';

import { provideExamples } from '../../../shared/example-provider';

import { TooltipCustomContentExampleComponent } from './tooltip-custom-content-example/tooltip-custom-content-example.component';
import { TooltipCustomIconExampleComponent } from './tooltip-custom-icon-example/tooltip-custom-icon-example.component';
import { TooltipSimpleExampleComponent } from './tooltip-simple-example/tooltip-simple-example.component';

const EXAMPLES = [
  TooltipCustomContentExampleComponent,
  TooltipCustomIconExampleComponent,
  TooltipSimpleExampleComponent,
];

const EXAMPLE_INDEX = {
  'tooltip-simple-example': TooltipSimpleExampleComponent,
  'tooltip-custom-content-example': TooltipCustomContentExampleComponent,
  'tooltip-custom-icon-example': TooltipCustomIconExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbButtonModule,
    SbbFormFieldModule,
    SbbLinksModule,
    SbbTooltipModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'tooltip', EXAMPLE_INDEX)],
})
export class TooltipExamplesModule {}
