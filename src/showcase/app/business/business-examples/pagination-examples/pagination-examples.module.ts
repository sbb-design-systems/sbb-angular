import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbFieldModule } from '@sbb-esta/angular-business/field';
import { SbbPaginationModule } from '@sbb-esta/angular-business/pagination';

import { provideExamples } from '../../../shared/example-provider';

import { NavigationExampleComponent } from './navigation-example/navigation-example.component';
import { PaginatorExampleComponent } from './paginator-example/paginator-example.component';

const EXAMPLES = [NavigationExampleComponent, PaginatorExampleComponent];

const EXAMPLE_INDEX = {
  'paginator-example': PaginatorExampleComponent,
  'navigation-example': NavigationExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbFieldModule,
    SbbPaginationModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'pagination', EXAMPLE_INDEX)],
})
export class PaginationExamplesModule {}
