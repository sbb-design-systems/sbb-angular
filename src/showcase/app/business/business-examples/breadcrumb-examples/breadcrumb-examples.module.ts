import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from '@sbb-esta/angular-business/breadcrumb';
import { IconHouseModule } from '@sbb-esta/angular-icons/navigation';

import { provideExamples } from '../../../shared/example-provider';

import { BreadcrumbExampleComponent } from './breadcrumb-example/breadcrumb-example.component';

const EXAMPLES = [BreadcrumbExampleComponent];

const EXAMPLE_INDEX = {
  'breadcrumb-example': BreadcrumbExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, BreadcrumbModule, IconHouseModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'breadcrumb', EXAMPLE_INDEX)],
})
export class BreadcrumbExamplesModule {}
