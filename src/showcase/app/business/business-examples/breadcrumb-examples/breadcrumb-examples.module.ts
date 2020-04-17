import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from '@sbb-esta/angular-business/breadcrumb';
import { IconHouseModule } from '@sbb-esta/angular-icons/navigation';

import { BreadcrumbExampleComponent } from './breadcrumb-example/breadcrumb-example.component';

const EXAMPLES = [BreadcrumbExampleComponent];

@NgModule({
  imports: [CommonModule, RouterModule, BreadcrumbModule, IconHouseModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class BreadcrumbExamplesModule {}
