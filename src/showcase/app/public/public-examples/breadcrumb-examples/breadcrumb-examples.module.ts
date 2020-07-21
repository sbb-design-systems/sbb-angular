import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { BreadcrumbModule } from '@sbb-esta/angular-public/breadcrumb';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { provideExamples } from '../../../shared/example-provider';

import { BreadcrumbExampleComponent } from './breadcrumb-example/breadcrumb-example.component';

const EXAMPLES = [BreadcrumbExampleComponent];

const EXAMPLE_INDEX = {
  'breadcrumb-example': BreadcrumbExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, SbbIconModule, BreadcrumbModule, DropdownModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'breadcrumb', EXAMPLE_INDEX)],
})
export class BreadcrumbExamplesModule {}
